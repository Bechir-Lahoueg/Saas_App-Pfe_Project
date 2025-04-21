package com.example.auth_service.controller;

import com.example.auth_service.dto.TenantLoginRequest;
import com.example.auth_service.dto.TenantLoginResponse;
import com.example.auth_service.entities.Tenant;
import com.example.auth_service.service.JwtService;
import com.example.auth_service.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tenant")
@RequiredArgsConstructor
public class TenantController {
    private final TenantService tenantService;


    @PostMapping("/login")
    public ResponseEntity<TenantLoginResponse> login(@RequestBody TenantLoginRequest request ) {
        return ResponseEntity.ok(
                TenantLoginResponse.builder()
                        .accessToken(tenantService.verify(request.getEmail(), request.getPassword()))
                        .build()
                );
//
//        return ResponseEntity.ok(
//                TenantLoginResponse.builder()
//                        .accessToken(jwtService.generateToken(tenant))
//                        .refreshToken(jwtService.generateRefreshToken(tenant))
//                        .build()
//        );
    }

//    @PostMapping("/login")
//    public ResponseEntity<TenantLoginResponse> login(@RequestBody TenantLoginRequest request) {
//        // Use the custom authentication method instead of AuthenticationManager
//        Tenant tenant = tenantService.authenticateTenant(request.getEmail(), request.getPassword());
//
//        return ResponseEntity.ok(
//                TenantLoginResponse.builder()
//                        .accessToken(jwtService.generateToken(tenant))
//                        .refreshToken(jwtService.generateRefreshToken(tenant))
//                        .tenant(mapToDTO(tenant))
//                        .build()
//        );
//    }

    @GetMapping("/getTenantByWorkCategory/{workCategory}")
    public ResponseEntity<List<Tenant>> getTenantByWorkCategory(@PathVariable String workCategory) {
        return ResponseEntity.ok(
                tenantService.getTenantsByWorkingCategory(workCategory)
        );
    }

    @GetMapping("/getall")
    public ResponseEntity<List<Tenant>> getAllTenants() {
        return ResponseEntity.ok(
                tenantService.getAllTenants()
        );
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Tenant> updateTenant(@PathVariable UUID id, @RequestBody Tenant tenant) {
        return new ResponseEntity<>(tenantService.updateTenant(id, tenant), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTenant(@PathVariable UUID id) {
        Tenant tenant = tenantService.getTenantById(id);
        tenantService.deleteTenant(tenant.getId());
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/get/{id}")
    public ResponseEntity<Tenant> getTenantById(@PathVariable UUID id) {
        Tenant tenant = tenantService.getTenantById(id);
        return ResponseEntity.ok((tenant));
    }

//    private TenantDTO mapToDTO(Tenant tenant) {
//        return TenantDTO.builder()
//                .id(tenant.getId())
//                .email(tenant.getEmail())
//                .firstName(tenant.getFirstName())
//                .lastName(tenant.getLastName())
//                .businessName(tenant.getBusinessName())
//                .subdomain(tenant.getSubdomain())
//                .address(tenant.getAddress())
//                .phone(tenant.getPhone())
//                .zipcode(tenant.getZipcode())
//                .country(tenant.getCountry())
//                .city(tenant.getCity())
//                .build();
//    }
}