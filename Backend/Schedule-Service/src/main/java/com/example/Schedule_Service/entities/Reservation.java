//package com.example.Schedule_Service.entities;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//import java.time.LocalDateTime;
//import java.util.UUID;
//
//@Entity
//@Table(name = "reservations")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//public class Reservation {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private LocalDateTime dateReservation;
//
//    @ManyToOne
//    private ServiceEntity service;
//
//    // Optionally:
//    @ManyToOne
//    private Employee employee;
//
//    // Optionally:
//    private Integer portion = 1; // if 1 = full field, 0 = half, 2 = custom
//}
