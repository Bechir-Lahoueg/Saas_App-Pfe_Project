package com.example.auth_service.service;

import com.example.auth_service.entities.Category;
import com.example.auth_service.entities.Tenant;
import com.example.auth_service.repository.TenantRepository;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

    public boolean existsByEmail(String email) {
        // Implementation depends on your repository layer
        return tenantRepository.existsByEmail(email);
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
        tenant.setAddress(tenantDetails.getAddress());
        tenant.setCity(tenantDetails.getCity());
        tenant.setZipcode(tenantDetails.getZipcode());
        tenant.setCountry(tenantDetails.getCountry());

        if (tenantDetails.getPassword() != null && !tenantDetails.getPassword().isEmpty()) {
            tenantDetails.setPassword(passwordEncoder.encode(tenantDetails.getPassword()));
        }
        return tenantRepository.save(tenant);
    }

    @Transactional
    public Tenant updateTenantProfileImage(UUID tenantId, String profileImageUrl) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        tenant.setProfileImageUrl(profileImageUrl);
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

    public Tenant getTenantBySubdomain(String subdomain) {
        return tenantRepository.findBySubdomain(subdomain)
                .orElseThrow(() ->
                        new RuntimeException("Tenant not found with subdomain: " + subdomain)
                );
    }

    @Transactional
    public void deleteTenant(UUID tenantId) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        tenantRepository.delete(tenant);
    }

    public String verify(String email, String password) {
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

    public boolean existsBySubdomain(String subdomain) {
        return tenantRepository.existsBySubdomain(subdomain);
    }
}