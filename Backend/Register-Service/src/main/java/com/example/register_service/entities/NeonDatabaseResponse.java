package com.example.register_service.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class NeonDatabaseResponse {
    private String id;
    private Database database;
    private String connectionString;


    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Database {
        private String id;
        private String name;
        private String connectionString;

    }

}