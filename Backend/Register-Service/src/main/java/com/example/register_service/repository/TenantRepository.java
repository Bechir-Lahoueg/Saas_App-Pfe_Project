package com.example.register_service.repository;


import com.example.register_service.entities.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
    Optional<Tenant> findByEmail(String email);  // Check if email already exists
    Optional<Tenant> findBySubdomain(String subdomain);  // Check if subdomain already exists
//    Optional <Tenant> findByTenantId(Long tenantId);  // Check if tenantId already exists
}
