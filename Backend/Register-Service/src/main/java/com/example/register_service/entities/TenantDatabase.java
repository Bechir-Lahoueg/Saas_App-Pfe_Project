package com.example.register_service.entities;

import com.example.register_service.entities.Tenant;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tenant_databases")
@Data
public class TenantDatabase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;

    private String serviceType; // e.g. "booking", "schedule", etc.
    private String databaseId;  // Neon database ID
    private String databaseName; // Actual database name

    private String connectionString;

}

