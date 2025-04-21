package com.example.register_service.controller;

import com.example.register_service.dto.TenantRegistrationRequest;
import com.example.register_service.entities.Tenant;
import com.example.register_service.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/tenant")
@RequiredArgsConstructor
public class TenantController {
    private final TenantService tenantService;

    @PostMapping("/signup")
    public ResponseEntity<Tenant> registerTenant(@RequestBody TenantRegistrationRequest request) {
        Tenant tenant = tenantService.provisionTenant(request);
        return ResponseEntity.ok((tenant));
    }
}