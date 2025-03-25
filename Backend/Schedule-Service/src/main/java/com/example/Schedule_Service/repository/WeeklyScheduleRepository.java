package com.example.Schedule_Service.repository;

import com.example.Schedule_Service.entities.WeeklySchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WeeklyScheduleRepository extends JpaRepository<WeeklySchedule, UUID> {
    List<WeeklySchedule> findByCalendarId(UUID calendarId);
    List<WeeklySchedule> findByCalendarIdAndIsActiveTrue(UUID calendarId);
//    Optional<WeeklySchedule> findByCalendarIdAndIsActiveTrue(UUID calendarId);

}