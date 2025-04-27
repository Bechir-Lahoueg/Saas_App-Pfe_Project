package com.example.Schedule_Service.repository;

import com.example.Schedule_Service.entities.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<Services, Long> {
    // Find a service by name (unique)
    Optional<Services> findByName(String name);
}
