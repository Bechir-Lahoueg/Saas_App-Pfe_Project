package com.example.auth_service.repository;


import com.example.auth_service.entities.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TenantRepository extends JpaRepository<Tenant, UUID> {
    Optional<Tenant> findByEmail(String email);
    List<Tenant> findByCategory_CategoryName(String categoryName);
}
