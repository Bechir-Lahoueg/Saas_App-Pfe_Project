package com.example.auth_service.repository;

import com.example.auth_service.entities.Abonne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AbonneRepository extends JpaRepository<Abonne, Long> {
    Optional<Abonne> findByEmail(String email);  // Check if email already exists
}