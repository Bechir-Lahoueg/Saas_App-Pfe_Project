package com.example.auth_service.controller;

import com.example.auth_service.service.TenantDatabaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/tenant-db")
@RequiredArgsConstructor
public class TenantDatabaseController {
    private final TenantDatabaseService databaseService;

    @GetMapping("/config/{tenantId}/{serviceType}")
    public ResponseEntity<Map<String, String>> getDatabaseConfig(
            @PathVariable String tenantId,
            @PathVariable String serviceType) {
        Map<String, String> config = databaseService.getDatabaseConfig(tenantId, serviceType);
        return ResponseEntity.ok(config);
    }
}