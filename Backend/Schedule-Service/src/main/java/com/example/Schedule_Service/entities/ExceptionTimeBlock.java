//package com.example.Schedule_Service.entities;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//import java.time.LocalTime;
//import java.util.UUID;
//
//@Entity
//@Table(name = "exception_time_blocks")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//public class ExceptionTimeBlock {
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    private UUID id;
//
//    @ManyToOne
//    @JoinColumn(name = "schedule_exception_id", nullable = false)
//    private ScheduleException scheduleException;
//
//    @Column(name = "start_time", nullable = false)
//    private LocalTime startTime;
//
//    @Column(name = "end_time", nullable = false)
//    private LocalTime endTime;
//
//    @ManyToOne
//    @JoinColumn(name = "employee_id")
//    private Employee employee;
//}