//package com.example.Schedule_Service.service;
//
//import com.example.Schedule_Service.DTO.ReservationRequestDTO;
//import com.example.Schedule_Service.entities.*;
//import com.example.Schedule_Service.repository.*;
//import jakarta.persistence.EntityNotFoundException;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class ReservationService {
//    private final ReservationRepository reservationRepository;
//    private final TimeBlockRepository timeBlockRepository;
//    private final ServiceRepository serviceRepository;
//    private final CalendarRepository calendarRepository;
//    private final EmployeeRepository employeeRepository;
//
//    public List<Reservation> getAllReservations() {
//        return reservationRepository.findAll();
//    }
//
//    public Optional<Reservation> getReservationById(UUID id) {
//        return reservationRepository.findById(id);
//    }
//
//    public List<Reservation> getReservationsByCalendarId(UUID calendarId) {
//        return reservationRepository.findByCalendarId(calendarId);
//    }
//
//    public List<Reservation> getReservationsByTimeBlockId(UUID timeBlockId) {
//        return reservationRepository.findByTimeBlockId(timeBlockId);
//    }
//
//    public List<Reservation> getReservationsByDateRange(UUID calendarId, LocalDateTime start, LocalDateTime end) {
//        return reservationRepository.findByCalendarIdAndDateReservationBetween(calendarId, start, end);
//    }
//
//    @Transactional
//    public Reservation createReservation(ReservationRequestDTO request) {
//        // Validate calendar
//        Calendar calendar = calendarRepository.findById(request.getCalendarId())
//                .orElseThrow(() -> new EntityNotFoundException("Calendar not found"));
//
//        // Validate time block
//        TimeBlock timeBlock = timeBlockRepository.findById(request.getTimeBlockId())
//                .orElseThrow(() -> new EntityNotFoundException("TimeBlock not found"));
//
//        // Make sure timeblock is available
//        if (timeBlock.getAvailabilityStatus() == TimeBlock.AvailabilityStatus.FULLY_BOOKED ||
//                timeBlock.getAvailabilityStatus() == TimeBlock.AvailabilityStatus.BLOCKED) {
//            throw new IllegalStateException("Selected time slot is not available");
//        }
//
//        // Validate service
//        ServiceEntity service = serviceRepository.findById(request.getServiceId())
//                .orElseThrow(() -> new EntityNotFoundException("Service not found"));
//
//        // Check capacity
//        int capacity = timeBlock.getRemainingCapacity() != null ?
//                timeBlock.getRemainingCapacity() : 1;
//
//        LocalDateTime reservationDateTime =
//                request.getDate().atTime(request.getStartTime());
//
//        long bookedCount = reservationRepository.countByTimeBlockAndDateReservation(
//                timeBlock, reservationDateTime);
//
//        if (bookedCount >= capacity) {
//            throw new IllegalStateException("No capacity left for the selected time slot");
//        }
//
//        // Get employee if requested
//        Employee employee = null;
//        if (request.getEmployeeId() != null) {
//            employee = employeeRepository.findById(request.getEmployeeId())
//                    .orElseThrow(() -> new EntityNotFoundException("Employee not found"));
//        }
//
//        // Create reservation
//        Reservation reservation = new Reservation();
//        reservation.setCalendar(calendar);
//        reservation.setTimeBlock(timeBlock);
//        reservation.setClientName(request.getClientName());
//        reservation.setClientEmail(request.getClientEmail());
//        reservation.setClientPhone(request.getClientPhone());
//        reservation.setService(service);
//        reservation.setDateReservation(reservationDateTime);
//        reservation.setNumberOfParticipants(request.getNumberOfParticipants());
//        reservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
//
//        // Save reservation
//        Reservation saved = reservationRepository.save(reservation);
//
//        // Update time block availability if needed
//        updateTimeBlockAvailability(timeBlock);
//
//        return saved;
//    }
//
//    @Transactional
//    public Reservation updateReservation(Reservation reservation) {
//        // Verify reservation exists
//        if (!reservationRepository.existsById(reservation.getId())) {
//            throw new EntityNotFoundException("Reservation not found with ID: " + reservation.getId());
//        }
//
//        // Save updated reservation
//        Reservation updated = reservationRepository.save(reservation);
//
//        // Update time block availability if needed
//        if (reservation.getTimeBlock() != null) {
//            updateTimeBlockAvailability(reservation.getTimeBlock());
//        }
//
//        return updated;
//    }
//
//    @Transactional
//    public Reservation updateReservationStatus(UUID id, Reservation.ReservationStatus status) {
//        Reservation reservation = reservationRepository.findById(id)
//                .orElseThrow(() -> new EntityNotFoundException("Reservation not found with ID: " + id));
//
//        reservation.setStatus(status);
//        Reservation updated = reservationRepository.save(reservation);
//
//        // If cancelled, update time block availability
//        if (status == Reservation.ReservationStatus.CANCELLED && reservation.getTimeBlock() != null) {
//            updateTimeBlockAvailability(reservation.getTimeBlock());
//        }
//
//        return updated;
//    }
//
//    @Transactional
//    public void deleteReservation(UUID id) {
//        Reservation reservation = reservationRepository.findById(id)
//                .orElseThrow(() -> new EntityNotFoundException("Reservation not found with ID: " + id));
//
//        // Get the time block before deletion for updating availability later
//        TimeBlock timeBlock = reservation.getTimeBlock();
//
//        reservationRepository.delete(reservation);
//
//        // Update time block availability if needed
//        if (timeBlock != null) {
//            updateTimeBlockAvailability(timeBlock);
//        }
//    }
//
//    private void updateTimeBlockAvailability(TimeBlock timeBlock) {
//        int capacity = timeBlock.getRemainingCapacity() != null ?
//                timeBlock.getRemainingCapacity() : 1;
//
//        long bookedCount = reservationRepository.countByTimeBlockId(timeBlock.getId());
//
//        if (bookedCount >= capacity) {
//            timeBlock.setAvailabilityStatus(TimeBlock.AvailabilityStatus.FULLY_BOOKED);
//        } else if (bookedCount > 0) {
//            timeBlock.setAvailabilityStatus(TimeBlock.AvailabilityStatus.PARTIALLY_BOOKED);
//        } else {
//            timeBlock.setAvailabilityStatus(TimeBlock.AvailabilityStatus.AVAILABLE);
//        }
//
//        timeBlockRepository.save(timeBlock);
//    }
//}