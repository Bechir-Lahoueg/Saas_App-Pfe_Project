//package com.example.Schedule_Service.entities;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//import java.util.UUID;
//
//@Entity
//@Table(name = "reservation_preferences")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//public class ReservationPreferences {
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    private UUID id;
//
//    @Column(name = "subscriber_id", nullable = false)
//    private Long subscriberId;
//
//    @Column(name = "reservation_duration")
//    private Integer reservationDuration;
//
//    @Column(name = "simultaneous_reservations")
//    private Boolean simultaneousReservations;
//
//    @Column(name = "cancellation_delay")
//    private Integer cancellationDelay;
//
//    @Column(name = "max_reservations_per_day")
//    private Integer maxReservationsPerDay;
//}