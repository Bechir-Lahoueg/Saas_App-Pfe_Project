package com.example.register_service.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Component
@RequiredArgsConstructor
public class DatabaseCreator {

    private final DataSource dataSource;

    public void createDatabase(String dbName) {
        try (Connection connection = dataSource.getConnection();
             Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("CREATE DATABASE " + dbName);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create database: " + dbName, e);
        }
    }
}
