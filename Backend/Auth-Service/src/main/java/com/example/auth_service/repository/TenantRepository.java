package com.example.auth_service.repository;


import com.example.auth_service.entities.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TenantRepository extends JpaRepository<Tenant, UUID> {
    Optional<Tenant> findByEmail(String email);
    Optional<List<Tenant>> findAllByWorkCategory(String workCategory);
}
