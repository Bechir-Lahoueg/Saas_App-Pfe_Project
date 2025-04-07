package com.example.auth_service.service;

import com.example.auth_service.entities.Tenant;
import com.example.auth_service.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TenantDatabaseService {
    private final TenantRepository tenantRepository;

    public Map<String, String> getDatabaseConfig(String tenantId, String serviceType) {
        log.info("Fetching database config for tenant {} and service {}", tenantId, serviceType);

        Tenant tenant = tenantRepository.findByTenantId(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found: " + tenantId));

        // Generate database connection string based on tenant ID and service type
        String connectionString = generateConnectionString(tenant, serviceType);

        Map<String, String> config = new HashMap<>();
        config.put("connectionString", connectionString);
        config.put("username", "neondb_owner");
        config.put("password", "npg_2CPyrate1KLs");  // In production, use secure methods

        return config;
    }

    private String generateConnectionString(Tenant tenant, String serviceType) {
        // Format: jdbc:postgresql://<host>:<port>/<tenant_id>_<service_type>
        return String.format("jdbc:postgresql://ep-bold-unit-a56gcruo.us-east-2.aws.neon.tech/tenant_%s_%s",
                tenant.getTenantId(), serviceType);
    }
}