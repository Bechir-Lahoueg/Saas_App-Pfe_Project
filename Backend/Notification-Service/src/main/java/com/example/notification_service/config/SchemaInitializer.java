package com.example.notification_service.config;

import com.example.notification_service.service.TenantDatabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

@Configuration
public class SchemaInitializer {

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Autowired
    private TenantDatabaseService tenantDatabaseService;

    @PostConstruct
    public void initializeSchemas() {
        tenantDatabaseService.getAllTenantDatabases().forEach((tenantId, connectionString) -> {
            if (!"default".equals(tenantId)) {
                try (Connection conn = DriverManager.getConnection(
                        connectionString, username, password)) {

                    System.out.println("Initializing schema for tenant: " + tenantId);

                    try (Statement stmt = conn.createStatement()) {
                        stmt.execute(
                                "CREATE TABLE IF NOT EXISTS notifications (" +
                                        "id SERIAL PRIMARY KEY, " +
                                        "title VARCHAR(255), " +
                                        "message TEXT, " +
                                        "read BOOLEAN DEFAULT FALSE" +
                                        ")"
                        );
                        System.out.println("Created notifications table for tenant: " + tenantId);
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        });
    }
}