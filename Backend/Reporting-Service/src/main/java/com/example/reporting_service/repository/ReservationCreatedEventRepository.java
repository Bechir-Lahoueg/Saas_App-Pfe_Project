package com.example.reporting_service.repository;

import com.example.reporting_service.entities.ReservationCreatedEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationCreatedEventRepository extends JpaRepository<ReservationCreatedEntity, Long> {
}
