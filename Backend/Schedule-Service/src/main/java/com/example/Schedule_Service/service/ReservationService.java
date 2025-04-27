package com.example.Schedule_Service.service;

import com.example.Schedule_Service.entities.Services;
import com.example.Schedule_Service.entities.Employee;
import com.example.Schedule_Service.entities.Reservation;
import com.example.Schedule_Service.repository.EmployeeRepository;
import com.example.Schedule_Service.repository.ReservationRepository;
import com.example.Schedule_Service.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private EmployeeRepository employeeRepository;

    // Retrieve all reservations
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // Find a reservation by ID
    public Reservation getReservation(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found"));
    }

    // Create a new reservation with validation
    @Transactional
    public Reservation createReservation(Reservation reservation) {
        Services service = serviceRepository.findById(reservation.getServiceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        // Validate required employee
        if (service.isRequiresEmployeeSelection() && reservation.getEmployeeId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This service requires selecting an employee");
        }
        if (reservation.getEmployeeId() != null) {
            Employee emp = employeeRepository.findById(reservation.getEmployeeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
            if (emp.getStatus() == Employee.Status.INACTIVE) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee is not active");
            }
        }

        // Prevent past times
        if (reservation.getStartTime().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reservation start time is in the past");
        }

        // Compute new reservation time window
        LocalDateTime newStart = reservation.getStartTime();
        LocalDateTime newEnd = newStart.plusMinutes(service.getDuration());

        // Fetch existing reservations for this service
        List<Reservation> existing = reservationRepository.findByServiceId(reservation.getServiceId());

        if (service.isAllowSimultaneous()) {
            // Check capacity constraint for overlapping reservations
            int totalAttendees = reservation.getNumberOfAttendees();
            for (Reservation r : existing) {
                LocalDateTime existingEnd = r.getStartTime().plusMinutes(service.getDuration());
                if (r.getStartTime().isBefore(newEnd) && existingEnd.isAfter(newStart)) {
                    totalAttendees += r.getNumberOfAttendees();
                }
            }
            if (totalAttendees > service.getCapacity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reservation exceeds service capacity");
            }
        } else {
            // Ensure no overlap at all for this service
            for (Reservation r : existing) {
                LocalDateTime existingEnd = r.getStartTime().plusMinutes(service.getDuration());
                if (r.getStartTime().isBefore(newEnd) && existingEnd.isAfter(newStart)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Overlapping reservation not allowed for this service");
                }
            }
        }

        // All checks passed; save reservation
        return reservationRepository.save(reservation);
    }

    // Update an existing reservation with validation (similar checks)
    @Transactional
    public Reservation updateReservation(Long id, Reservation updatedReservation) {
        if (!reservationRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found");
        }
        updatedReservation.setId(id);

        Services service = serviceRepository.findById(updatedReservation.getServiceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

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
        if (updatedReservation.getStartTime().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reservation start time is in the past");
        }

        LocalDateTime newStart = updatedReservation.getStartTime();
        LocalDateTime newEnd = newStart.plusMinutes(service.getDuration());
        List<Reservation> existingReservations = reservationRepository.findByServiceId(updatedReservation.getServiceId());

        if (service.isAllowSimultaneous()) {
            int totalAttendees = updatedReservation.getNumberOfAttendees();
            for (Reservation r : existingReservations) {
                if (r.getId().equals(id)) continue; // Skip itself
                LocalDateTime existingEnd = r.getStartTime().plusMinutes(service.getDuration());
                if (r.getStartTime().isBefore(newEnd) && existingEnd.isAfter(newStart)) {
                    totalAttendees += r.getNumberOfAttendees();
                }
            }
            if (totalAttendees > service.getCapacity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reservation exceeds service capacity");
            }
        } else {
            for (Reservation r : existingReservations) {
                if (r.getId().equals(id)) continue; // Skip itself
                LocalDateTime existingEnd = r.getStartTime().plusMinutes(service.getDuration());
                if (r.getStartTime().isBefore(newEnd) && existingEnd.isAfter(newStart)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Overlapping reservation not allowed for this service");
                }
            }
        }

        return reservationRepository.save(updatedReservation);
    }

    // Delete a reservation by ID
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }
}