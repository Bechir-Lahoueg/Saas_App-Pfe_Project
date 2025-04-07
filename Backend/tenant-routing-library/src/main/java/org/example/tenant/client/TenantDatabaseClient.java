package org.example.tenant.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Map;

/**
 * Client for retrieving tenant database configuration from the auth service
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TenantDatabaseClient {
    private final WebClient.Builder webClientBuilder;

    @Value("${tenant.routing.service-type:${spring.application.name}}")
    private String serviceType;

    @Value("${tenant.routing.auth-service-url:http://auth-service}")
    private String authServiceUrl;

    @Value("${tenant.routing.config-endpoint:/tenant-db/config}")
    private String configEndpoint;

    @Value("${tenant.routing.timeout-seconds:5}")
    private int timeoutSeconds;

    /**
     * Retrieves database configuration for the specified tenant
     *
     * @param tenantId The tenant identifier
     * @return A map containing database configuration properties
     */
    public Map<String, String> getDatabaseConfig(String tenantId) {
        log.info("Fetching database config for tenant {} and service {}", tenantId, serviceType);

        String uri = authServiceUrl + configEndpoint + "/{tenantId}/{serviceType}";

        try {
            Map<String, String> config = webClientBuilder.build()
                    .get()
                    .uri(uri, tenantId, serviceType)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, String>>() {})
                    .block(Duration.ofSeconds(timeoutSeconds));

            log.info("Retrieved database config for tenant {}", tenantId);
            return config;
        } catch (Exception e) {
            log.error("Failed to retrieve database config: {}", e.getMessage(), e);
            // Return a default config or throw exception based on your requirements
            throw new RuntimeException("Failed to retrieve database configuration", e);
        }
    }
}