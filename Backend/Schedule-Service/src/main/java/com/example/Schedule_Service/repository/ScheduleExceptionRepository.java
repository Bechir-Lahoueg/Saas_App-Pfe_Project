package com.example.Schedule_Service.repository;

import com.example.Schedule_Service.entities.ScheduleException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ScheduleExceptionRepository extends JpaRepository<ScheduleException, UUID> {
    List<ScheduleException> findByCalendarId(UUID calendarId);
    Optional<ScheduleException> findByCalendarIdAndExceptionDate(UUID calendarId, LocalDate date);
    List<ScheduleException> findByCalendarIdAndExceptionDateBetween(UUID calendarId, LocalDate startDate, LocalDate endDate);
}