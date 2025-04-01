package com.example.auth_service.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class NeonDatabaseResponse {
    private String id;
    private Database database;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Database {
        private String id;
        private String name;
    }

    // Handle nested response structure from Neon API
    public String getId() {
        // Try to get ID from top level, if null try from nested database object
        return (id != null) ? id : (database != null ? database.getId() : null);
    }
}