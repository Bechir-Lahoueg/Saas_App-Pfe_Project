package com.example.auth_service.controller;

import com.example.auth_service.dto.TenantLoginRequest;
import com.example.auth_service.dto.TenantLoginResponse;
import com.example.auth_service.dto.TenantDTO;
import com.example.auth_service.entities.Subscriber;
import com.example.auth_service.entities.Tenant;
import com.example.auth_service.dto.TenantRegistrationRequest;
import com.example.auth_service.service.JwtService;
import com.example.auth_service.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tenant")
@RequiredArgsConstructor
public class TenantController {
    private final TenantService tenantService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<TenantDTO> registerTenant(@RequestBody TenantRegistrationRequest request) {
        Tenant tenant = tenantService.provisionTenant(request);
        return ResponseEntity.ok(mapToDTO(tenant));
    }

    @PostMapping("/login")
    public ResponseEntity<TenantLoginResponse> login(@RequestBody TenantLoginRequest request) {
        // Use the custom authentication method instead of AuthenticationManager
        Tenant tenant = tenantService.authenticateTenant(request.getEmail(), request.getPassword());

        return ResponseEntity.ok(
                TenantLoginResponse.builder()
                        .accessToken(jwtService.generateToken(tenant))
                        .refreshToken(jwtService.generateRefreshToken(tenant))
                        .tenant(mapToDTO(tenant))
                        .build()
        );
    }

    @GetMapping("/all")
    public ResponseEntity<List<TenantDTO>> getAllTenants() {
        return ResponseEntity.ok(
                tenantService.getAllTenants().stream()
                        .map(this::mapToDTO)
                        .collect(Collectors.toList())
        );
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Tenant> updateTenant(@PathVariable Long id, @RequestBody Tenant tenant) {
        return new ResponseEntity<>(tenantService.updateTenant(id, tenant), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTenant(@PathVariable Long id) {
        Tenant tenant = tenantService.getTenantById(id);
        tenantService.deleteTenant(tenant.getId());
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/get/{id}")
    public ResponseEntity<TenantDTO> getTenantById(@PathVariable Long id) {
        Tenant tenant = tenantService.getTenantById(id);
        return ResponseEntity.ok(mapToDTO(tenant));
    }


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