package com.example.reporting_service.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Setter
@Getter
@RequiredArgsConstructor
@Entity
@Table(name="category_events")
public class CategoryEventEntity {
    @Id
    @GeneratedValue
    private Long id;

    @Column(name="category_id", nullable=false)
    private Long categoryId;

    @Column(name="category_name", nullable=false)
    private String categoryName;

    @Column(name="occurred_at", nullable=false)
    private Instant timestamp;
}
