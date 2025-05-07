package com.example.reporting_service.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Setter
@Getter
@Table(name ="reservation_created_events")
@Entity
public class ReservationCreatedEntity {
    @Id
    @GeneratedValue
    private Long Id;

    private Long reservationId;
    private String clientEmail;
    private String clientPhoneNumber;
    private String confirmationCode;
    private LocalDateTime startTime;
    private String status;

}
