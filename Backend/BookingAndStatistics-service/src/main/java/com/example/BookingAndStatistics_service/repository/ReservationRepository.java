package com.example.BookingAndStatistics_service.repository;

import com.example.BookingAndStatistics_service.entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}