package com.example.Schedule_Service.service;

import com.example.Schedule_Service.config.RabbitConfig;
import com.example.Schedule_Service.context.TenantContext;
import com.example.Schedule_Service.entities.Employee;
import com.example.Schedule_Service.entities.Reservation;
import com.example.Schedule_Service.entities.Services;
import com.example.Schedule_Service.entities.WorkingDay;
import com.example.Schedule_Service.events.ReservationConfirmedEvent;
import com.example.Schedule_Service.events.ReservationCreatedEvent;
import com.example.Schedule_Service.repository.EmployeeRepository;
import com.example.Schedule_Service.repository.ReservationRepository;
import com.example.Schedule_Service.repository.ServiceRepository;
import com.example.Schedule_Service.repository.WorkingDayRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Random;

@RequiredArgsConstructor
@Slf4j
@Service
public class ReservationService {

    @Autowired
    private final RabbitTemplate rabbit;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private WorkingDayRepository workingDayRepository;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservation(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found"));
    }

    //--------------------------------TENANT------------------------------------------
    @Transactional
    public Reservation createReservation(Reservation reservation) {
        log.info("[START] Creating reservation: {}", reservation);

        // 1) fetch service
        Services service = serviceRepository.findById(reservation.getServiceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        // 1a) check attendee count against maxAttendees
        if (reservation.getNumberOfAttendees() > service.getMaxAttendees()) {
            log.error("[STEP 1a] numberOfAttendees {} exceeds maxAttendees {}",
                    reservation.getNumberOfAttendees(), service.getMaxAttendees());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Number of attendees cannot exceed " + service.getMaxAttendees());
        }

        // 2) employee-required check
        if (service.isRequiresEmployeeSelection()) {
            if (reservation.getEmployeeId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "This service requires selecting an employee");
            }
            Employee emp = employeeRepository.findById(reservation.getEmployeeId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Employee not found"));
            if (emp.getStatus() == Employee.Status.INACTIVE) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Employee is not active");
            }
        }

        // 3) time validations (duration, endTime)
        if (reservation.getEndTime() == null) {
            reservation.setEndTime(reservation.getStartTime().plusMinutes(service.getDuration()));
        }
        if (!reservation.getEndTime().isAfter(reservation.getStartTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "endTime must be after startTime");
        }
        long actualDuration = java.time.Duration.between(
                reservation.getStartTime(), reservation.getEndTime()).toMinutes();
        if (actualDuration != service.getDuration()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Reservation length must equal service duration");
        }

        // 4) no past bookings
        if (reservation.getStartTime().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Reservation start time is in the past");
        }

        // 5) working-day & timeslot check
        WorkingDay wd = workingDayRepository.findByDayOfWeek(reservation.getStartTime().getDayOfWeek())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "No working-day defined"));
        if (!wd.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Service is not available on this day");
        }
        LocalTime startLocal = reservation.getStartTime().toLocalTime();
        LocalTime endLocal   = reservation.getEndTime().toLocalTime();
        boolean fits = wd.getTimeSlots().stream().anyMatch(ts ->
                !startLocal.isBefore(ts.getStartTime()) && !endLocal.isAfter(ts.getEndTime())
        );
        if (!fits) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Requested time is outside of working hours");
        }

        // 6) per-service conflict & simultaneous handling using capacity
        List<Reservation> svcExisting = reservationRepository.findByServiceId(service.getId());
        if (service.isAllowSimultaneous()) {
            int concurrentCount = 0;
            for (Reservation r : svcExisting) {
                if (r.getStartTime().isBefore(reservation.getEndTime()) &&
                        r.getEndTime().isAfter(reservation.getStartTime())) {
                    concurrentCount++;
                }
            }
            if (concurrentCount >= service.getCapacity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Service is fully booked for this timeslot");
            }
        } else {
            for (Reservation r : svcExisting) {
                if (r.getStartTime().isBefore(reservation.getEndTime()) &&
                        r.getEndTime().isAfter(reservation.getStartTime())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Overlapping reservation not allowed");
                }
            }
        }

        // 7) employee-level conflict
        if (reservation.getEmployeeId() != null) {
            List<Reservation> empExisting = reservationRepository.findByEmployeeId(reservation.getEmployeeId());
            for (Reservation r : empExisting) {
                if (r.getStartTime().isBefore(reservation.getEndTime()) &&
                        r.getEndTime().isAfter(reservation.getStartTime())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Selected employee is already booked");
                }
            }
        }

        reservation.setStatus(Reservation.Status.CONFIRMED);
        reservation.setConfirmationCode(String.format("%06d", new Random().nextInt(1_000_000)));

        // 8) save
        Reservation saved = reservationRepository.save(reservation);

        // 9) publish confirmed event
        var evt = new ReservationConfirmedEvent(
                saved.getId(), saved.getClientEmail(), saved.getClientPhoneNumber(),
                saved.getConfirmationCode(), saved.getStartTime()
        );
        rabbit.convertAndSend(RabbitConfig.EXCHANGE, "reservation.confirmed", evt);
        return saved;
    }

    //--------------------CLIENT--------------------------------------------
    @Transactional
    public Reservation createClientReservation(Reservation reservation) {
        log.info("[START] Client creating reservation: {}", reservation);

        Services service = serviceRepository.findById(reservation.getServiceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
        if (reservation.getNumberOfAttendees() > service.getMaxAttendees()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Number of attendees cannot exceed " + service.getMaxAttendees());
        }

        // 2) employee-required check
        if (service.isRequiresEmployeeSelection()) {
            if (reservation.getEmployeeId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "This service requires selecting an employee");
            }
            Employee emp = employeeRepository.findById(reservation.getEmployeeId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Employee not found"));
            if (emp.getStatus() == Employee.Status.INACTIVE) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Employee is not active");
            }
        }

        // 3) time validations (duration, endTime)
        if (reservation.getEndTime() == null) {
            reservation.setEndTime(reservation.getStartTime().plusMinutes(service.getDuration()));
        }
        if (!reservation.getEndTime().isAfter(reservation.getStartTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "endTime must be after startTime");
        }
        long actualDuration = java.time.Duration.between(
                reservation.getStartTime(), reservation.getEndTime()).toMinutes();
        if (actualDuration != service.getDuration()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Reservation length must equal service duration");
        }

        // 4) no past bookings
        if (reservation.getStartTime().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Reservation start time is in the past");
        }

        // 5) working-day & timeslot check
        WorkingDay wd = workingDayRepository.findByDayOfWeek(reservation.getStartTime().getDayOfWeek())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "No working-day defined"));
        if (!wd.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Service is not available on this day");
        }
        LocalTime startLocal = reservation.getStartTime().toLocalTime();
        LocalTime endLocal   = reservation.getEndTime().toLocalTime();
        boolean fits = wd.getTimeSlots().stream().anyMatch(ts ->
                !startLocal.isBefore(ts.getStartTime()) && !endLocal.isAfter(ts.getEndTime())
        );
        if (!fits) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Requested time is outside of working hours");
        }

        // 6) per-service conflict & simultaneous handling using capacity
        List<Reservation> svcExisting = reservationRepository.findByServiceId(service.getId());
        if (service.isAllowSimultaneous()) {
            int concurrentCount = 0;
            for (Reservation r : svcExisting) {
                if (r.getStartTime().isBefore(reservation.getEndTime()) &&
                        r.getEndTime().isAfter(reservation.getStartTime())) {
                    concurrentCount++;
                }
            }
            if (concurrentCount >= service.getCapacity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Service is fully booked for this timeslot");
            }
        } else {
            for (Reservation r : svcExisting) {
                if (r.getStartTime().isBefore(reservation.getEndTime()) &&
                        r.getEndTime().isAfter(reservation.getStartTime())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Overlapping reservation not allowed");
                }
            }
        }

        // 7) employee-level conflict
        if (reservation.getEmployeeId() != null) {
            List<Reservation> empExisting = reservationRepository.findByEmployeeId(reservation.getEmployeeId());
            for (Reservation r : empExisting) {
                if (r.getStartTime().isBefore(reservation.getEndTime()) &&
                        r.getEndTime().isAfter(reservation.getStartTime())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Selected employee is already booked");
                }
            }
        }

        // 8) persist
        log.info("[STEP 8] Saving reservation");
        reservation.setConfirmationCode(String.format("%06d", new Random().nextInt(1_000_000)));


        reservationRepository.save(reservation);

        // publish “created” event
        var evt = new ReservationCreatedEvent(
                reservation.getId(),
                reservation.getClientEmail(),
                reservation.getClientPhoneNumber(),
                reservation.getConfirmationCode(),
                reservation.getStartTime()
        );
        log.info("[STEP 9] Publishing reservation created event: {}", evt);
        rabbit.convertAndSend(RabbitConfig.EXCHANGE, "reservation.created", evt);
        // 2) publish event for notifications
        return reservation;
    }



    @Transactional
    public Reservation updateReservation(Long id, Reservation updatedReservation) {
        // same as createReservation, but skip self when checking overlaps
        if (!reservationRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found");
        }
        updatedReservation.setId(id);

        // 1) fetch service
        Services service = serviceRepository.findById(updatedReservation.getServiceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
        if (updatedReservation.getNumberOfAttendees() > service.getMaxAttendees()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Number of attendees cannot exceed " + service.getMaxAttendees());
        }
        // 2) employee-required check
        if (service.isRequiresEmployeeSelection() && updatedReservation.getEmployeeId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This service requires selecting an employee");
        }
        if (updatedReservation.getEmployeeId() != null) {
            Employee emp = employeeRepository.findById(updatedReservation.getEmployeeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
            if (emp.getStatus() == Employee.Status.INACTIVE) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee is not active");
            }
        }

        // 3) no past
        if (updatedReservation.getStartTime().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reservation start time is in the past");
        }

        // 4) working-day & timeslot
        DayOfWeek dow = updatedReservation.getStartTime().getDayOfWeek();
        WorkingDay wd = workingDayRepository.findByDayOfWeek(dow)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "No working-day defined for " + dow));
        if (!wd.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Service is not available on " + dow);
        }
        LocalTime startLocal = updatedReservation.getStartTime().toLocalTime();
        LocalTime endLocal   = startLocal.plusMinutes(service.getDuration());
        boolean fits = wd.getTimeSlots().stream().anyMatch(ts ->
                !startLocal.isBefore(ts.getStartTime()) && !endLocal.isAfter(ts.getEndTime())
        );
        if (!fits) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Requested time is outside of working hours on " + dow);
        }

        // 5) conflict & capacity
        LocalDateTime newStart = updatedReservation.getStartTime();
        LocalDateTime newEnd   = newStart.plusMinutes(service.getDuration());
        List<Reservation> existing = reservationRepository.findByServiceId(updatedReservation.getServiceId());

        if (service.isAllowSimultaneous()) {
            int totalAttendees = updatedReservation.getNumberOfAttendees();
            for (Reservation r : existing) {
                if (r.getId().equals(id)) continue;
                LocalDateTime existingEnd = r.getStartTime().plusMinutes(service.getDuration());
                if (r.getStartTime().isBefore(newEnd) && existingEnd.isAfter(newStart)) {
                    totalAttendees += r.getNumberOfAttendees();
                }
            }
            if (totalAttendees > service.getMaxAttendees()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Reservation exceeds maximum attendees for this service");
            }
        } else {
            for (Reservation r : existing) {
                if (r.getId().equals(id) &&
                        r.getStartTime().isBefore(newEnd) && r.getEndTime().isAfter(newStart)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Overlapping reservation not allowed for this service");
                }
            }
        }

        return reservationRepository.save(updatedReservation);
    }

    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    @Transactional
    public void deletePendingReservationsForCurrentTenant() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(30);
        List<Reservation> stale = reservationRepository
                .findByStatusAndCreatedAtBefore(Reservation.Status.PENDING, cutoff);

        if (!stale.isEmpty()) {
            log.info("[{}] deleting {} unconfirmaed reservations",
                    TenantContext.getCurrentTenant(), stale.size());
            reservationRepository.deleteAll(stale);
        }
    }

    @Transactional
    public void confirmReservation(Long id, String code) {
        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));
        if (r.getStatus() != Reservation.Status.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Already confirmed or expired");
        }
        if (!r.getConfirmationCode().equals(code)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid code");
        }
        r.setStatus(Reservation.Status.CONFIRMED);
        reservationRepository.save(r);

        // 2) publish Rabbit “reservation.confirmed” event
        var confirmedEvt = new ReservationConfirmedEvent(
                r.getId(),
                r.getClientEmail(),
                r.getClientPhoneNumber(),
                r.getConfirmationCode(),
                r.getStartTime()
        );
        rabbit.convertAndSend(RabbitConfig.EXCHANGE, "reservation.confirmed", confirmedEvt);
        log.info("Publishing reservation confirmed event: {}", confirmedEvt);
        log.info("Reservation {} confirmed", id);
    }
}




