package com.example.register_service.service;

import com.example.register_service.entities.NeonDatabaseResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NeonDatabaseService {
    @Value("${neon.api.key}")
    private String apiKey;

    @Value("${neon.project.id}")
    private String projectId;

    @Value("${neon.branch.id}")
    private String branchId;

    private final WebClient webClient;

    /**
     * Creates a new database for a tenant in Neon with retry logic
     */
    public String createTenantDatabase(String tenantId, String serviceType) {
        String cleanTenantId = tenantId.replaceAll("[^a-zA-Z0-9]", "_");
        String dbName = serviceType + "_" + cleanTenantId;
        String url = "https://console.neon.tech/api/v2/projects/" + projectId + "/branches/" + branchId + "/databases";
        Map<String, Object> requestBody = Map.of(
                "database", Map.of(
                        "name", dbName,
                        "owner_name",
                        "neondb_owner"
                )
        );

        int maxRetries = 5;
        int retryCount = 0;
        int baseDelay = 1000; // 1 second initial delay

        while (retryCount < maxRetries) {
            try {
                NeonDatabaseResponse response = webClient.post()
                        .uri(url)
                        .header("Authorization", "Bearer " + apiKey)
                        .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                        .bodyValue(requestBody)
                        .retrieve()
                        .bodyToMono(NeonDatabaseResponse.class)
                        .block();

                // Add debug logging to check response contents
                log.info("Created database {} for tenant {}. Response ID: {}",
                        dbName, tenantId, response != null ? response.getId() : "null");

                return response != null ? response.getId() : null;
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 423) {
                    retryCount++;
                    if (retryCount >= maxRetries) {
                        log.error("Maximum retries reached. Failed to create database for tenant {}: {}",
                                tenantId, e.getMessage());
                        throw new RuntimeException("Database creation failed after " + maxRetries + " retries: " + e.getMessage());
                    }

                    // Exponential backoff with jitter
                    long delay = baseDelay * (long) Math.pow(2, retryCount) + (long) (Math.random() * 1000);
                    log.info("Resource locked, retrying in {} ms (attempt {}/{})", delay, retryCount, maxRetries);

                    try {
                        Thread.sleep(delay);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Thread interrupted during retry delay", ie);
                    }
                } else {
                    log.error("Failed to create database for tenant {}: {}", tenantId, e.getMessage());
                    throw new RuntimeException("Database creation failed: " + e.getMessage());
                }
            } catch (Exception e) {
                log.error("Failed to create database for tenant {}: {}", tenantId, e.getMessage());
                throw new RuntimeException("Database creation failed: " + e.getMessage());
            }
        }
        throw new RuntimeException("Failed to create database after all retries");
    }


    public void deleteTenantDatabase(String databaseName) {
        String url = "https://console.neon.tech/api/v2/projects/" + projectId + "/branches/" + branchId + "/databases/" + databaseName;

        try {
            log.info("Attempting to delete database with Name {} using URL: {}", databaseName, url);

            var response = webClient.delete()
                    .uri(url)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .retrieve()
                    .toBodilessEntity()
                    .block(Duration.ofSeconds(10));

            log.info("Delete database response status: {}", response.getStatusCode());
            log.info("Deleted database with Name {}", databaseName);
        } catch (Exception e) {
            log.error("Failed to delete database {}: {}", databaseName, e.getMessage());
            throw new RuntimeException("Database deletion failed: " + e.getMessage());
        }
    }
}