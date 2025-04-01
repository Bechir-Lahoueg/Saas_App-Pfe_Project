package com.example.auth_service.repository;


import com.example.auth_service.entities.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
    Optional<Tenant> findByEmail(String email);  // Check if email already exists
//    Optional <Tenant> findByTenantId(Long tenantId);  // Check if tenantId already exists
}
