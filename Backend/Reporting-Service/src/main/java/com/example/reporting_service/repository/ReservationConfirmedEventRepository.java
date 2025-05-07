package com.example.reporting_service.repository;

import com.example.reporting_service.entities.ReservationConfirmedEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationConfirmedEventRepository extends JpaRepository<ReservationConfirmedEntity, Long> {
}
