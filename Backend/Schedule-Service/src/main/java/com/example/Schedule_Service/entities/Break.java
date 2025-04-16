//package com.example.Schedule_Service.entities;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//import java.time.DayOfWeek;
//import java.time.LocalTime;
//import java.util.UUID;
//
//@Entity
//@Table(name = "recurring_breaks")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//public class Break {
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    private UUID id;
//
//    @ManyToOne
//    @JoinColumn(name = "calendar_id", nullable = false)
//    private Calendar calendar;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private DayOfWeek dayOfWeek;
//
//    @Column(name = "start_time", nullable = false)
//    private LocalTime startTime;
//
//    @Column(name = "end_time", nullable = false)
//    private LocalTime endTime;
//
//    @Column(name = "description")
//    private String description;
//
//    @Column(name = "active", nullable = false)
//    private boolean active = true;
//}