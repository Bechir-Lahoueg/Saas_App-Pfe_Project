//package com.example.Schedule_Service.entities;
//
//import com.fasterxml.jackson.annotation.*;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//import java.time.DayOfWeek;
//import java.util.List;
//import java.util.UUID;
//
//@Entity
//@Table(name = "daily_schedules")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@JsonIdentityInfo(
//        generator = ObjectIdGenerators.PropertyGenerator.class,
//        property = "id")
//public class DailySchedule {
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    private UUID id;
//
//    @ManyToOne
//    @JoinColumn(name = "weekly_schedule_id", nullable = false)
//    private WeeklySchedule weeklySchedule;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private DayOfWeek dayOfWeek;
//
//    @JsonProperty("is_working_day") // Add this annotation
//    @Column(name = "is_working_day")
//    private boolean isWorkingDay;
//
//    @OneToMany(mappedBy = "dailySchedule", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<TimeBlock> timeBlocks;
//}