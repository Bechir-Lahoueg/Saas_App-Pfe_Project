package com.example.auth_service.controller;

import com.example.auth_service.entities.Tenant;
import com.example.auth_service.entities.TenantDatabase;
import com.example.auth_service.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/tenant-db")
@RequiredArgsConstructor
public class TenantDatabaseController {
    private final TenantService tenantService;

    @GetMapping("/config/{tenantId}/{serviceType}")
    public ResponseEntity<Map<String, String>> getDatabaseConfig(
            @PathVariable Long tenantId,
            @PathVariable String serviceType) {

        Tenant tenant = tenantService.getTenantById(tenantId);

        TenantDatabase database = tenant.getDatabases().stream()
                .filter(db -> db.getServiceType().equals(serviceType))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Database not found for service: " + serviceType));

        Map<String, String> config = Map.of(
                "databaseName", database.getDatabaseName(),
                "connectionString", database.getConnectionString()
        );

        return ResponseEntity.ok(config);
    }
}
