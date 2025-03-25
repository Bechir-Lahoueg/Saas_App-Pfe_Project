package com.example.Schedule_Service.repository;

import com.example.Schedule_Service.entities.Break;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.UUID;

public interface BreakRepository extends JpaRepository<Break, UUID> {
    List<Break> findByCalendarIdAndActive(UUID calendarId, boolean active);
    List<Break> findByCalendarIdAndDayOfWeekAndActive(UUID calendarId, DayOfWeek dayOfWeek, boolean active);
}
