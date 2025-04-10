package com.example.notification_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;

@Service
public class TenantDatabaseService {

    @Value("${spring.datasource.url}")
    private String defaultUrl;

    @Value("${spring.datasource.username}")
    private String defaultUsername;

    @Value("${spring.datasource.password}")
    private String defaultPassword;

    @Autowired
    private RestTemplate restTemplate;

    // Remove this @Bean method to break the circular dependency
    // @Bean
    // public RestTemplate restTemplate() {
    //     return new RestTemplate();
    // }

    public Map<String, String> getAllTenantDatabases() {
        Map<String, String> databases = new HashMap<>();

        // Add default connection for fallback
        databases.put("default", defaultUrl);

        try {
            // Call Auth service to retrieve tenant databases
            // For tenant1 with ID fde0d48e-104f-42d0-9b58-c3643b5b4aeb
            String url = "http://auth-service/auth/tenant/databases";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(headers), Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                // Process the response and add to databases map
                response.getBody().forEach((key, value) -> {
                    databases.put(key.toString(), value.toString());
                });
            }

            System.out.println("Loaded tenant databases: " + databases);
        } catch (Exception e) {
            // Fallback to known tenant for testing
            databases.put("tenant1", "jdbc:postgresql://ep-dawn-thunder-a9sbtsgp-pooler.gwc.azure.neon.tech/notification-service-tenant1?sslmode=require");
            System.err.println("Failed to load tenant databases: " + e.getMessage());
        }

        return databases;
    }
}