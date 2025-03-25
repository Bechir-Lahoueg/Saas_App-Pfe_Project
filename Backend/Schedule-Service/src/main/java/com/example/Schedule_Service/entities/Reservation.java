package com.example.Schedule_Service.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "calendar_id", nullable = false)
    private Calendar calendar;

    @ManyToOne
    @JoinColumn(name = "time_block_id")
    private TimeBlock timeBlock;

    @ManyToOne
    @JoinColumn(name = "exception_time_block_id")
    private ExceptionTimeBlock exceptionTimeBlock;

    @Column(name = "client_email", nullable = false)
    private String clientEmail;

    @Column(name = "client_name", nullable = false)
    private String clientName;

    @Column(name = "client_phone")
    private String clientPhone;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    @Column(name = "date_reservation", nullable = false)
    private LocalDateTime dateReservation;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    @Column(name = "number_of_participants", nullable = false)
    private Integer numberOfParticipants;

    public enum ReservationStatus {
        CONFIRMED, CANCELLED, PENDING
    }
}