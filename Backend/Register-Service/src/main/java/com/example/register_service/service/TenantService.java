package com.example.register_service.service;


import com.example.register_service.entities.Tenant;
import com.example.register_service.dto.TenantRegistrationRequest;
import com.example.register_service.repository.TenantRepository;
import com.example.register_service.util.DatabaseCreator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TenantService {

    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final DatabaseCreator databaseCreator;

    public Tenant provisionTenant(TenantRegistrationRequest request) {
        if (tenantRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }
        if (tenantRepository.findBySubdomain(request.getSubdomain()).isPresent()) {
            throw new RuntimeException("Subdomain already exists!");
        }

        // Step 1: Create DB first
        String dbName = request.getSubdomain(); // "tenant4"
        databaseCreator.createDatabase(dbName);
        log.info("Creating database for tenant {}", dbName);

        // Step 2: Create Tenant entity
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
                .build();

        return tenantRepository.save(tenant);
    }
}