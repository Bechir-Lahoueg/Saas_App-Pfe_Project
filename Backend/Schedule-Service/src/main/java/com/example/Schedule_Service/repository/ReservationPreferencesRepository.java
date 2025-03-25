package com.example.Schedule_Service.repository;

import com.example.Schedule_Service.entities.ReservationPreferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReservationPreferencesRepository extends JpaRepository<ReservationPreferences, UUID> {
    Optional<ReservationPreferences> findBySubscriberId(Long subscriberId);
}