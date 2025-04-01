package com.example.register_service.service;


import com.example.register_service.dto.TenantRegistrationRequest;
import com.example.register_service.entities.Tenant;
import com.example.register_service.entities.TenantDatabase;
import com.example.register_service.repository.TenantRepository;
import com.example.register_service.service.NeonDatabaseService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Transactional
public class TenantService {
    private final TenantRepository tenantRepository;
    private final NeonDatabaseService neonDatabaseService;
    private final PasswordEncoder passwordEncoder;

    public Tenant provisionTenant(TenantRegistrationRequest request) {
        if (tenantRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }
        // Generate unique tenant ID
        String tenantId = generateTenantId(request.getBusinessName());

        // Create tenant record
        Tenant tenant = Tenant.builder()
                .tenantId(tenantId)
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .businessName(request.getBusinessName())
                .subdomain(request.getSubdomain())
                .address(request.getAddress())
                .createdAt(LocalDateTime.now())
                .databases(new ArrayList<>())
                .build();

        tenant = tenantRepository.save(tenant);

        // Create databases for each service
        List<String> services = List.of(
                "schedule-service",
                "notification-service",
                "reporting-service",
                "clientbooking-service"
        );
        for (String service : services) {
            String dbId = neonDatabaseService.createTenantDatabase(tenant.getTenantId(), service);
            String dbName = service + "_" + tenantId;
            TenantDatabase db = new TenantDatabase();
            db.setTenant(tenant);
            db.setServiceType(service);
            db.setDatabaseName(dbName); // Store the database name
            db.setDatabaseId(dbId);
            tenant.getDatabases().add(db);
        }
        return tenantRepository.save(tenant);
    }

    public Tenant getTenantById(Long id) {
        return tenantRepository.findById(id)
                .orElseThrow(() ->
                   new RuntimeException("Tenant not found with id: " + id)
                );
    }

    private String generateTenantId(String businessName) {
        String base = businessName.toLowerCase()
                .replaceAll("[^a-z0-9]", "-")
                .replaceAll("-+", "-");
        return base + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

}

