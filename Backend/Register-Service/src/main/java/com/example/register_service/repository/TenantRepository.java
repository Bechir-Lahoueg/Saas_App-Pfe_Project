package com.example.register_service.repository;


import com.example.register_service.entities.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TenantRepository extends JpaRepository<Tenant, UUID> {
    Optional<Tenant> findByEmail(String email);  // Check if email already exists
    Optional<Tenant> findBySubdomain(String subdomain);  // Check if subdomain already exists
}
