package com.example.register_service.controller;

import com.example.register_service.dto.TenantDTO;
import com.example.register_service.dto.TenantRegistrationRequest;
import com.example.register_service.entities.Tenant;
import com.example.register_service.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tenant")
@RequiredArgsConstructor
public class ApiTenantController {
    private final TenantService tenantService;
    
    /**
     * API endpoint for external services to register a tenant
     */
    @PostMapping("/register")
    public ResponseEntity<TenantDTO> registerTenantFromExternalService(
            @RequestBody TenantRegistrationRequest request) {
        try {
            Tenant tenant = tenantService.provisionTenant(request);
            return ResponseEntity.ok(mapToDTO(tenant));
        } catch (Exception e) {
            // Log the error
            System.err.println("Error registering tenant via API: " + e.getMessage());
            throw e;
        }
    }
    
    /**
     * Get tenant information by ID
     */

    
    /**
     * Map tenant entity to DTO
     */
    private TenantDTO mapToDTO(Tenant tenant) {
        return TenantDTO.builder()
                .id(tenant.getId())
                .tenantId(tenant.getTenantId())
                .email(tenant.getEmail())
                .firstName(tenant.getFirstName())
                .lastName(tenant.getLastName())
                .businessName(tenant.getBusinessName())
                .subdomain(tenant.getSubdomain())
                .build();
    }
}
