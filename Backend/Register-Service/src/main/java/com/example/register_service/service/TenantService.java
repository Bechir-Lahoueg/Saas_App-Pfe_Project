package com.example.register_service.service;


import com.example.register_service.entities.Tenant;
import com.example.register_service.entities.TenantDatabase;
import com.example.register_service.dto.TenantRegistrationRequest;
import com.example.register_service.repository.TenantRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TenantService {

    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;

    public Tenant provisionTenant(TenantRegistrationRequest request) {
        if (tenantRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }
        if (tenantRepository.findBySubdomain(request.getSubdomain()).isPresent()) {
            throw new RuntimeException("subdomain already exists!");
        }
        // Create tenant record
        Tenant tenant = Tenant.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .businessName(request.getBusinessName())
                .subdomain(request.getSubdomain())
                .address(request.getAddress())
                .zipcode(request.getZipcode())
                .country(request.getCountry())
                .city(request.getCity())
                .databases(new ArrayList<>())
                .build();
        return tenantRepository.save(tenant);
    }
}