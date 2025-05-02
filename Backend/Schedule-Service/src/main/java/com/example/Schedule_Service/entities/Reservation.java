package com.example.Schedule_Service.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long serviceId;
    private Long employeeId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int numberOfAttendees;
    private String clientFirstName;
    private String clientLastName;
    private String clientPhoneNumber;
    private String clientEmail;
    private String confirmationCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status= Status.PENDING;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public enum Status {
        PENDING,
        CONFIRMED,
        EXPIRED
    }

}
