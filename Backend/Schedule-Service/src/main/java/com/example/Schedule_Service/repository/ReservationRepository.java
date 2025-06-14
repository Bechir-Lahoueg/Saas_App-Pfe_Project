package com.example.Schedule_Service.repository;

import com.example.Schedule_Service.entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Find all reservations for a given service
    List<Reservation> findByServiceId(Long serviceId);
    List<Reservation> findByEmployeeId(Long employeeId);
    List<Reservation> findByStatusAndCreatedAtBefore(Reservation.Status status, LocalDateTime cutoff);

}