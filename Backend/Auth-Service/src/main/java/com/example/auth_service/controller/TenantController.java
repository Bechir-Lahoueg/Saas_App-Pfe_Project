package com.example.auth_service.controller;

import com.example.auth_service.dto.TenantLoginRequest;
import com.example.auth_service.dto.TenantLoginResponse;
import com.example.auth_service.entities.Tenant;
import com.example.auth_service.service.CloudinaryService;
import com.example.auth_service.service.JwtService;
import com.example.auth_service.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/tenant")
@RequiredArgsConstructor
public class TenantController {
    private final TenantService tenantService;
    private final CloudinaryService cloudinaryService;

    @PostMapping("/login")
    public ResponseEntity<TenantLoginResponse> login(@RequestBody TenantLoginRequest request) {
        return ResponseEntity.ok(
                TenantLoginResponse.builder()
                        .accessToken(tenantService.verify(request.getEmail(), request.getPassword()))
                        .build()
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

    @GetMapping("/getTenantByCategory/{categoryName}")
    public ResponseEntity<List<Tenant>> getByCategory(
            @PathVariable String categoryName) {
        List<Tenant> tenants = tenantService.getTenantsByCategoryName(categoryName);
        return ResponseEntity.ok(tenants);
    }

    @PostMapping(value = "/upload-profile-image/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Tenant> uploadProfileImage(
            @PathVariable UUID id,
            @RequestPart(value = "image") MultipartFile image) {

        if (image == null || image.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Tenant tenant = tenantService.getTenantById(id);

        // Supprimer l'ancienne image si elle existe
        if (tenant.getProfileImageUrl() != null) {
            cloudinaryService.deleteTenantProfileImage(tenant.getProfileImageUrl());
        }

        // Télécharger la nouvelle image
        String imageUrl = cloudinaryService.uploadTenantProfileImage(image);

        // Sauvegarder le tenant mis à jour
        Tenant updatedTenant = tenantService.updateTenantProfileImage(id, imageUrl);

        return ResponseEntity.ok(updatedTenant);
    }

    @GetMapping("/getTenantBySubdomain/{subdomain}")
    public ResponseEntity<Tenant> getTenantBySubdomain(@PathVariable String subdomain) {
        Tenant tenant = tenantService.getTenantBySubdomain(subdomain);
        return ResponseEntity.ok(tenant);
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Map<String, Boolean>> checkEmailExists(@PathVariable String email) {
        boolean exists = tenantService.existsByEmail(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-subdomain/{subdomain}")
    public ResponseEntity<Map<String, Boolean>> checkSubdomainExists(@PathVariable String subdomain) {
        boolean exists = tenantService.existsBySubdomain(subdomain);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
}