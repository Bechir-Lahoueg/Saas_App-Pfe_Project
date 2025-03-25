package com.example.Schedule_Service.service;


import com.example.Schedule_Service.DTO.AvailableSlotDTO;
import com.example.Schedule_Service.entities.*;
import com.example.Schedule_Service.entities.Calendar;
import com.example.Schedule_Service.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.example.Schedule_Service.entities.ServiceEntity;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AvailableSLotsService {

    private final CalendarRepository calendarRepository;
    private final WeeklyScheduleRepository weeklyScheduleRepository;
    private final DailyScheduleRepository dailyScheduleRepository;
    private final TimeBlockRepository timeBlockRepository;
    private final ScheduleExceptionRepository exceptionRepository;
    private final ReservationRepository reservationRepository;
    private final ServiceRepository serviceRepository;

    private final BreakService breakService;

    public Map<LocalDate, List<AvailableSlotDTO>> findAvailableSlots(
            UUID calendarId, LocalDate startDate, LocalDate endDate, UUID serviceId) {

        // Get calendar and active weekly schedule
        Calendar calendar = calendarRepository.findById(calendarId)
                .orElseThrow(() -> new EntityNotFoundException("Calendar not found"));

        WeeklySchedule activeSchedule = weeklyScheduleRepository
                .findByCalendarIdAndIsActiveTrue(calendarId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("No active weekly schedule found"));

        // Get requested service
        ServiceEntity requestedService = null;
        if (serviceId != null) {
            requestedService = serviceRepository.findById(serviceId)
                    .orElseThrow(() -> new EntityNotFoundException("Service not found"));
        }

        // Get exceptions in date range
        List<ScheduleException> exceptions = exceptionRepository
                .findByCalendarIdAndExceptionDateBetween(calendarId, startDate, endDate);

        // Get existing reservations
        List<Reservation> existingReservations = reservationRepository
                .findByCalendarIdAndDateReservationBetween(
                        calendarId,
                        startDate.atStartOfDay(),
                        endDate.plusDays(1).atStartOfDay());

        // Result map
        Map<LocalDate, List<AvailableSlotDTO>> result = new HashMap<>();

        // Process each date in range
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            LocalDate currentDate = date; // For lambda use

            // Skip if day is marked as exception DAY_OFF
            if (exceptions.stream()
                    .anyMatch(e -> e.getExceptionDate().equals(currentDate) &&
                            e.getExceptionType() == ScheduleException.ExceptionType.DAY_OFF)) {
                continue;
            }

            // Find matching daily schedule
            DayOfWeek dayOfWeek = currentDate.getDayOfWeek();
            Optional<DailySchedule> dailyScheduleOpt = activeSchedule.getDailySchedules().stream()
                    .filter(ds -> ds.getDayOfWeek() == dayOfWeek && ds.isWorkingDay())
                    .findFirst();

            if (dailyScheduleOpt.isPresent()) {
                List<AvailableSlotDTO> availableSlots = findAvailableSlotsForDay(
                        dailyScheduleOpt.get(), currentDate, existingReservations, requestedService);

                if (!availableSlots.isEmpty()) {
                    result.put(currentDate, availableSlots);
                }
            }
        }

        return result;
    }

    private List<AvailableSlotDTO> findAvailableSlotsForDay(
            DailySchedule dailySchedule,
            LocalDate date,
            List<Reservation> reservations,
            ServiceEntity requestedService) {

        List<AvailableSlotDTO> result = new ArrayList<>();

        // Get recurring breaks for this day of week
        // You need to inject this service in the class constructor
        List<Break> recurringBreaks = breakService
                .getBreaksByCalendarAndDay(
                        dailySchedule.getWeeklySchedule().getCalendar().getId(),
                        date.getDayOfWeek());

        for (TimeBlock timeBlock : dailySchedule.getTimeBlocks()) {
            // Skip blocks that are fully booked or blocked
            if (timeBlock.getAvailabilityStatus() == TimeBlock.AvailabilityStatus.FULLY_BOOKED ||
                    timeBlock.getAvailabilityStatus() == TimeBlock.AvailabilityStatus.BLOCKED) {
                continue;
            }

            // Skip if timeblock overlaps with a recurring break
            if (recurringBreaks.stream().anyMatch(rb ->
                    timeBlockOverlapsWithBreak(timeBlock, rb))) {
                continue;
            }

            // Rest of your existing code remains the same...
            // Calculate remaining capacity...
        }

        return result;
    }

    // Update the method signature to match your RecurringBreak entity
    private boolean timeBlockOverlapsWithBreak(TimeBlock timeBlock, Break recurringBreak) {
        return !(timeBlock.getEndTime().isBefore(recurringBreak.getStartTime()) ||
                timeBlock.getStartTime().isAfter(recurringBreak.getEndTime()));
    }
}



