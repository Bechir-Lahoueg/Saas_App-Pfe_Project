package com.example.register_service.service;

import com.example.register_service.entities.Tenant;
import com.example.register_service.dto.TenantRegistrationRequest;
import com.example.register_service.events.TenantCreatedEvent;
import com.example.register_service.repository.TenantRepository;
import com.example.register_service.util.DatabaseCreator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TenantService {

    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final DatabaseCreator databaseCreator;
    private final RabbitTemplate rabbit;

    @Autowired
    private final DirectExchange tenantExchange;


    // Inject the database credentials from the application properties
    @Value("${spring.datasource.username}")
    private String dbUser;

    @Value("${spring.datasource.password}")
    private String dbPass;

    public Tenant provisionTenant(TenantRegistrationRequest request) {
        if (tenantRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }
        if (tenantRepository.findBySubdomain(request.getSubdomain()).isPresent()) {
            throw new RuntimeException("Subdomain already exists!");
        }

        // Create the database
        String dbName = request.getSubdomain();
        databaseCreator.createDatabase(dbName);
        log.info("Created database for tenant {}", dbName);

        // Run Flyway migrations on the created database
        String tenantDbUrl = "jdbc:postgresql://localhost:5432/" + dbName;
        Flyway flyway = Flyway.configure()
                .dataSource(tenantDbUrl, dbUser, dbPass)
                .locations("classpath:db/migration")
                .baselineOnMigrate(true) // if needed for non-empty schemas
                .load();
        flyway.migrate();
        log.info("Applied migrations for tenant database: {}", dbName);

        // Create the tenant entity
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
                .categoryId(request.getCategoryId())
                .build();

        return tenantRepository.save(tenant);

    }
}
