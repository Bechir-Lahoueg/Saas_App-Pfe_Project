package com.example.register_service.controller;

import com.example.register_service.dto.TenantDTO;
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
    public ResponseEntity<TenantDTO> registerTenant(@RequestBody TenantRegistrationRequest request) {
        Tenant tenant = tenantService.provisionTenant(request);
        return ResponseEntity.ok(mapToDTO(tenant));
    }


    private TenantDTO mapToDTO(Tenant tenant) {
        return TenantDTO.builder()
                .id(tenant.getId())
                .email(tenant.getEmail())
                .firstName(tenant.getFirstName())
                .lastName(tenant.getLastName())
                .businessName(tenant.getBusinessName())
                .subdomain(tenant.getSubdomain())
                .address(tenant.getAddress())
                .phone(tenant.getPhone())
                .zipcode(tenant.getZipcode())
                .country(tenant.getCountry())
                .city(tenant.getCity())
                .build();
    }
}