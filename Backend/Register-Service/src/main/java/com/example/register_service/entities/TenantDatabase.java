package com.example.register_service.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "tenant_databases")
@Data
public class TenantDatabase {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;

    private String serviceType; // e.g. "booking", "schedule", etc.
    private String databaseName; // Actual database name

    private String connectionString;

}

