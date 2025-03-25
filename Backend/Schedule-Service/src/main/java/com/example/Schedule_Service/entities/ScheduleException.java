package com.example.Schedule_Service.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "schedule_exceptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleException {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "calendar_id", nullable = false)
    private Calendar calendar;

    @Column(name = "exception_date", nullable = false)
    private LocalDate exceptionDate;

    @Enumerated(EnumType.STRING)
    private ExceptionType exceptionType;

    @OneToMany(mappedBy = "scheduleException", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExceptionTimeBlock> customTimeBlocks;

    public enum ExceptionType {
        DAY_OFF,
        CUSTOM_HOURS
    }
}