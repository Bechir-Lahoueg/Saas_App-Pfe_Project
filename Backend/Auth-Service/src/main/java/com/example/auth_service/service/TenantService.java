package com.example.auth_service.service;


import com.example.auth_service.entities.Tenant;
import com.example.auth_service.entities.TenantDatabase;
import com.example.auth_service.repository.TenantRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Transactional
public class TenantService {
    private final TenantRepository tenantRepository;
    private final NeonDatabaseService neonDatabaseService;
    private final PasswordEncoder passwordEncoder;



    @Transactional
    public Tenant updateTenant(UUID tenantId, Tenant tenantDetails) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
            tenant.setEmail(tenantDetails.getEmail());
            tenant.setFirstName(tenantDetails.getFirstName());
            tenant.setLastName(tenantDetails.getLastName());
            tenant.setPhone(tenantDetails.getPhone());
            tenant.setBusinessName(tenantDetails.getBusinessName());
            tenant.setSubdomain(tenantDetails.getSubdomain());
            tenant.setAddress(tenantDetails.getAddress());

            if (tenantDetails.getPassword() != null && !tenantDetails.getPassword().isEmpty()) {
                tenantDetails.setPassword(passwordEncoder.encode(tenantDetails.getPassword()));
            }
        return tenantRepository.save(tenant);
    }


    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }


    public Tenant getTenantById(UUID id) {
        return tenantRepository.findById(id)
                .orElseThrow(() ->
                   new RuntimeException("Tenant not found with id: " + id)
                );
    }

    @Transactional
    public void deleteTenant(UUID tenantId) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        // Delete all tenant databases in Neon
        for (TenantDatabase database : tenant.getDatabases()) {
            try {
                // If databaseName is already stored:
                if (database.getDatabaseName() != null) {
                    neonDatabaseService.deleteTenantDatabase(database.getDatabaseName());
                }
            } catch (Exception e) {
                System.err.println("Failed to delete tenant database %s: %s");
            }
        }
        // Delete the tenant from our database
        tenantRepository.delete(tenant);
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

