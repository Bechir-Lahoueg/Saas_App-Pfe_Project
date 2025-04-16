//package com.example.Schedule_Service.entities;
//
//import com.fasterxml.jackson.annotation.JsonIdentityInfo;
//import com.fasterxml.jackson.annotation.ObjectIdGenerators;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//import java.util.List;
//import java.util.UUID;
//
//@Entity
//@Table(name = "calendars")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@JsonIdentityInfo(
//        generator = ObjectIdGenerators.PropertyGenerator.class,
//        property = "id")
//public class Calendar {
//
//        @Id
//        @GeneratedValue(strategy = GenerationType.UUID)
//        private UUID id;
//
//        @Column(nullable = false)
//        private String name;
//
//        private String timezone;
//
//        @Enumerated(EnumType.STRING)
//        private CalendrierStatus status;
//
////        @OneToMany(mappedBy = "calendar", cascade = CascadeType.ALL)
////        private List<WeeklySchedule> weeklySchedules;
////
////        @OneToMany(mappedBy = "calendar", cascade = CascadeType.ALL)
////        private List<ScheduleException> scheduleExceptions;
////
////
////
////        @OneToMany(mappedBy = "calendar", cascade = CascadeType.ALL)
////        private List<Reservation> reservations;
//
//        public enum CalendrierStatus {
//                ACTIVE, INACTIVE
//        }
//
//
//
//}