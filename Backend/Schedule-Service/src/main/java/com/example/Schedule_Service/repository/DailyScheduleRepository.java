package com.example.Schedule_Service.repository;

import com.example.Schedule_Service.entities.DailySchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DailyScheduleRepository extends JpaRepository<DailySchedule, UUID> {
    List<DailySchedule> findByWeeklyScheduleId(UUID weeklyScheduleId);
    Optional<DailySchedule> findByWeeklyScheduleIdAndDayOfWeek(UUID weeklyScheduleId, DayOfWeek dayOfWeek);
}