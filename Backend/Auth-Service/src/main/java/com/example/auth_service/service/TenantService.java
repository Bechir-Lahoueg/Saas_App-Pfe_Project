package com.example.auth_service.service;


import com.example.auth_service.entities.Tenant;
import com.example.auth_service.entities.TenantDatabase;
import com.example.auth_service.dto.TenantRegistrationRequest;
import com.example.auth_service.repository.TenantRepository;
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

//        tenant = tenantRepository.save(tenant);

        // Create databases for each service
        List<String> services = List.of(
                "auth-service",
                "schedule-service",
                "notification-service",
                "reporting-service",
                "clientbooking-service",
                "register-service"
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

    @Transactional
    public Tenant updateTenant(Long tenantId, Tenant tenantDetails) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
            tenant.setEmail(tenantDetails.getEmail());
            tenant.setFirstName(tenantDetails.getFirstName());
            tenant.setLastName(tenantDetails.getLastName());
            tenant.setPhone(tenantDetails.getPhone());
            tenant.setBusinessName(tenantDetails.getBusinessName());
            tenant.setSubdomain(tenantDetails.getSubdomain());
            tenant.setAddress(tenantDetails.getAddress());
            tenant.setUpdatedAt(LocalDateTime.now());

            if (tenantDetails.getPassword() != null && !tenantDetails.getPassword().isEmpty()) {
                tenantDetails.setPassword(passwordEncoder.encode(tenantDetails.getPassword()));
            }
        return tenantRepository.save(tenant);
    }


    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }


    public Tenant getTenantById(Long id) {
        return tenantRepository.findById(id)
                .orElseThrow(() ->
                   new RuntimeException("Tenant not found with id: " + id)
                );
    }

    @Transactional
    public void deleteTenant(Long tenantId) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        // Delete all tenant databases in Neon
        for (TenantDatabase database : tenant.getDatabases()) {
            try {
                // If databaseName is already stored:
                if (database.getDatabaseName() != null) {
                    neonDatabaseService.deleteTenantDatabase(database.getDatabaseName());
                } else {
                    // Recreate the database name using the same pattern as in creation
                    String cleanTenantId = tenant.getTenantId().replaceAll("[^a-zA-Z0-9]", "_");
                    String dbName = database.getServiceType() + "_" + cleanTenantId;
                    neonDatabaseService.deleteTenantDatabase(dbName);
                }
            } catch (Exception e) {
                System.err.println(String.format("Failed to delete tenant database %s: %s",
                        database.getDatabaseId(), e.getMessage()));
            }
        }
        // Delete the tenant from our database
        tenantRepository.delete(tenant);
    }


    private String generateTenantId(String businessName) {
        String base = businessName.toLowerCase()
                .replaceAll("[^a-z0-9]", "-")
                .replaceAll("-+", "-");
        return base + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    // Add this method to TenantService class
    public Tenant authenticateTenant(String email, String password) {
        Tenant tenant = tenantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, tenant.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return tenant;
    }
}

