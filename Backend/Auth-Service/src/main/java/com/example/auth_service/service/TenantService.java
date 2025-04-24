package com.example.auth_service.service;


import com.example.auth_service.entities.Tenant;
import com.example.auth_service.repository.TenantRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Transactional
public class TenantService {
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authManager;
    @Autowired
    private JwtService jwtService;


    public List<Tenant> getTenantsByCategoryName(String categoryName) {
        return tenantRepository.findByCategory_CategoryName(categoryName);
    }

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
        tenantRepository.delete(tenant);
    }

    public String verify(String email,String password) {
        Authentication authentication =
                authManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
                if(authentication.isAuthenticated()) {
                    Tenant tenant = tenantRepository.findByEmail(email)
                            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
                    return jwtService.generateToken(tenant);
                } else {
                    throw new RuntimeException("Authentication failed");
                }
    }
}

