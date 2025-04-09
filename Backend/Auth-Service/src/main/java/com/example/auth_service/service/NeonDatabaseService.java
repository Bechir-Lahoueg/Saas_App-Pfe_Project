package com.example.auth_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

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