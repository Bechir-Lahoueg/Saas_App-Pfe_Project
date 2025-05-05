package com.example.reporting_service.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "tenant_event_entity")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class TenantEventEntity {
    @Id
    @GeneratedValue
    Long id;
    UUID tenantId;
    Long categoryId;
    Instant timestamp;
}
