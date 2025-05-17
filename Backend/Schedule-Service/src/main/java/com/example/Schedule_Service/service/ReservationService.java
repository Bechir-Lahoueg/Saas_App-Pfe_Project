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
        log.info("[STEP 1] Fetching service by ID: {}", reservation.getServiceId());
        Services service = serviceRepository.findById(reservation.getServiceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        // 2) employee-required check
        if (service.isRequiresEmployeeSelection()) {
            log.info("[STEP 2] Service requires employee selection");
            if (reservation.getEmployeeId() == null) {
                log.error("[STEP 2] No employee selected");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "This service requires selecting an employee");
            }
            Employee emp = employeeRepository.findById(reservation.getEmployeeId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Employee not found"));
            log.info("[STEP 2] Employee fetched: {}", emp);
            if (emp.getStatus() == Employee.Status.INACTIVE) {
                log.error("[STEP 2] Employee is inactive");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Employee is not active");
            }
        }

        // 3) ensure endTime is set, matches duration, and is after startTime
        if (reservation.getEndTime() == null) {
            reservation.setEndTime(reservation.getStartTime().plusMinutes(service.getDuration()));
            log.info("[STEP 3] auto-set endTime to {}", reservation.getEndTime());
        }
        if (!reservation.getEndTime().isAfter(reservation.getStartTime())) {
            log.error("[STEP 3] endTime {} is not after startTime {}",
                    reservation.getEndTime(), reservation.getStartTime());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "endTime must be after startTime");
        }
        long actualDuration = java.time.Duration.between(
                reservation.getStartTime(), reservation.getEndTime()).toMinutes();
        if (actualDuration != service.getDuration()) {
            log.error("[STEP 3] actual duration {} does not match service duration {}",
                    actualDuration, service.getDuration());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Reservation length must equal service duration");
        }

        // 4) no past bookings
        LocalDateTime now = LocalDateTime.now();
        if (reservation.getStartTime().isBefore(now)) {
            log.error("[STEP 4] Reservation start time {} is in the past",
                    reservation.getStartTime());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Reservation start time is in the past");
        }

        // 5) working-day & timeslot check (unchanged logic, but use endTime)
        DayOfWeek dow = reservation.getStartTime().getDayOfWeek();
        WorkingDay wd = workingDayRepository.findByDayOfWeek(dow)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "No working-day defined for " + dow));
        if (!wd.isActive()) {
            log.error("[STEP 5] Working day {} is inactive", dow);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Service is not available on " + dow);
        }
        LocalTime startLocal = reservation.getStartTime().toLocalTime();
        LocalTime endLocal   = reservation.getEndTime().toLocalTime();
        boolean fits = wd.getTimeSlots().stream().anyMatch(ts ->
                !startLocal.isBefore(ts.getStartTime()) && !endLocal.isAfter(ts.getEndTime())
        );
        if (!fits) {
            log.error("[STEP 5] {}–{} outside of working slots on {}", startLocal, endLocal, dow);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Requested time is outside of working hours on " + dow);
        }

        // 6) per-service conflict & capacity
        LocalDateTime newStart = reservation.getStartTime();
        LocalDateTime newEnd   = reservation.getEndTime();
        List<Reservation> svcExisting = reservationRepository.findByServiceId(reservation.getServiceId());
        log.info("[STEP 6] {} existing reservations for service {}", svcExisting.size(), service.getId());

        if (service.isAllowSimultaneous()) {
            int totalAttendees = reservation.getNumberOfAttendees();
            for (Reservation r : svcExisting) {
                if (r.getStartTime().isBefore(newEnd) && r.getEndTime().isAfter(newStart)) {
                    totalAttendees += r.getNumberOfAttendees();
                }
            }
            log.info("[STEP 6] totalAttendees after new: {}", totalAttendees);
            if (totalAttendees > service.getMaxAttendees()) {
                log.error("[STEP 6] exceeds maxAttendees {}", service.getMaxAttendees());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Reservation exceeds maximum attendees for this service");
            }
        } else {
            for (Reservation r : svcExisting) {
                if (r.getStartTime().isBefore(newEnd) && r.getEndTime().isAfter(newStart)) {
                    log.error("[STEP 6] overlap with reservation {}", r.getId());
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Overlapping reservation not allowed for this service");
                }
            }
        }

        // 7) employee-level conflict (across *all* services)
        if (reservation.getEmployeeId() != null) {
            List<Reservation> empExisting = reservationRepository.findByEmployeeId(reservation.getEmployeeId());
            log.info("[STEP 7] {} existing reservations for employee {}",
                    empExisting.size(), reservation.getEmployeeId());
            for (Reservation r : empExisting) {
                if (r.getStartTime().isBefore(newEnd) && r.getEndTime().isAfter(newStart)) {
                    log.error("[STEP 7] employee overlap with reservation {}", r.getId());
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Selected employee is already booked during that time");
                }
            }
        }
        reservation.setStatus(Reservation.Status.CONFIRMED);
        reservation.setConfirmationCode(String.format("%06d", new Random().nextInt(1_000_000)));

        // 8) persist
        log.info("[STEP 8] Saving reservation");
        Reservation saved = reservationRepository.save(reservation);
        log.info("[SUCCESS] Reservation created: {}", saved);

        var evt = new ReservationConfirmedEvent(
                reservation.getId(),
                reservation.getClientEmail(),
                reservation.getClientPhoneNumber(),
                reservation.getConfirmationCode(),
                reservation.getStartTime()
        );
        log.info("[STEP 9] Publishing reservation confirmed event: {}", evt);
        rabbit.convertAndSend("reservation.confirmed", evt);

        return saved;


    }

    //--------------------CLIENT--------------------------------------------
    @Transactional
    public Reservation createClientReservation(Reservation reservation) {
        log.info("[START] Creating reservation: {}", reservation);

        // 1) fetch service
        log.info("[STEP 1] Fetching service by ID: {}", reservation.getServiceId());
        Services service = serviceRepository.findById(reservation.getServiceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        // 2) employee-required check
        if (service.isRequiresEmployeeSelection()) {
            log.info("[STEP 2] Service requires employee selection");
            if (reservation.getEmployeeId() == null) {
                log.error("[STEP 2] No employee selected");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "This service requires selecting an employee");
            }
            Employee emp = employeeRepository.findById(reservation.getEmployeeId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Employee not found"));
            log.info("[STEP 2] Employee fetched: {}", emp);
            if (emp.getStatus() == Employee.Status.INACTIVE) {
                log.error("[STEP 2] Employee is inactive");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Employee is not active");
            }
        }

        // 3) ensure endTime is set, matches duration, and is after startTime
        if (reservation.getEndTime() == null) {
            reservation.setEndTime(reservation.getStartTime().plusMinutes(service.getDuration()));
            log.info("[STEP 3] auto-set endTime to {}", reservation.getEndTime());
        }
        if (!reservation.getEndTime().isAfter(reservation.getStartTime())) {
            log.error("[STEP 3] endTime {} is not after startTime {}",
                    reservation.getEndTime(), reservation.getStartTime());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "endTime must be after startTime");
        }
        long actualDuration = java.time.Duration.between(
                reservation.getStartTime(), reservation.getEndTime()).toMinutes();
        if (actualDuration != service.getDuration()) {
            log.error("[STEP 3] actual duration {} does not match service duration {}",
                    actualDuration, service.getDuration());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Reservation length must equal service duration");
        }

        // 4) no past bookings
        LocalDateTime now = LocalDateTime.now();
        if (reservation.getStartTime().isBefore(now)) {
            log.error("[STEP 4] Reservation start time {} is in the past",
                    reservation.getStartTime());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Reservation start time is in the past");
        }

        // 5) working-day & timeslot check (unchanged logic, but use endTime)
        DayOfWeek dow = reservation.getStartTime().getDayOfWeek();
        WorkingDay wd = workingDayRepository.findByDayOfWeek(dow)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "No working-day defined for " + dow));
        if (!wd.isActive()) {
            log.error("[STEP 5] Working day {} is inactive", dow);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Service is not available on " + dow);
        }
        LocalTime startLocal = reservation.getStartTime().toLocalTime();
        LocalTime endLocal   = reservation.getEndTime().toLocalTime();
        boolean fits = wd.getTimeSlots().stream().anyMatch(ts ->
                !startLocal.isBefore(ts.getStartTime()) && !endLocal.isAfter(ts.getEndTime())
        );
        if (!fits) {
            log.error("[STEP 5] {}–{} outside of working slots on {}", startLocal, endLocal, dow);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Requested time is outside of working hours on " + dow);
        }

        // 6) per-service conflict & capacity
        LocalDateTime newStart = reservation.getStartTime();
        LocalDateTime newEnd   = reservation.getEndTime();
        List<Reservation> svcExisting = reservationRepository.findByServiceId(reservation.getServiceId());
        log.info("[STEP 6] {} existing reservations for service {}", svcExisting.size(), service.getId());

        if (service.isAllowSimultaneous()) {
            int totalAttendees = reservation.getNumberOfAttendees();
            for (Reservation r : svcExisting) {
                if (r.getStartTime().isBefore(newEnd) && r.getEndTime().isAfter(newStart)) {
                    totalAttendees += r.getNumberOfAttendees();
                }
            }
            log.info("[STEP 6] totalAttendees after new: {}", totalAttendees);
            if (totalAttendees > service.getMaxAttendees()) {
                log.error("[STEP 6] exceeds maxAttendees {}", service.getMaxAttendees());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Reservation exceeds maximum attendees for this service");
            }
        } else {
            for (Reservation r : svcExisting) {
                if (r.getStartTime().isBefore(newEnd) && r.getEndTime().isAfter(newStart)) {
                    log.error("[STEP 6] overlap with reservation {}", r.getId());
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Overlapping reservation not allowed for this service");
                }
            }
        }

        // 7) employee-level conflict (across *all* services)
        if (reservation.getEmployeeId() != null) {
            List<Reservation> empExisting = reservationRepository.findByEmployeeId(reservation.getEmployeeId());
            log.info("[STEP 7] {} existing reservations for employee {}",
                    empExisting.size(), reservation.getEmployeeId());
            for (Reservation r : empExisting) {
                if (r.getStartTime().isBefore(newEnd) && r.getEndTime().isAfter(newStart)) {
                    log.error("[STEP 7] employee overlap with reservation {}", r.getId());
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Selected employee is already booked during that time");
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




