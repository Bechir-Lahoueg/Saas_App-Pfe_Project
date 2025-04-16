package com.example.Schedule_Service.repository;

import com.example.Schedule_Service.entities.WorkingDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.Optional;

@Repository
public interface WorkingDayRepository extends JpaRepository<WorkingDay, Long> {
    Optional<WorkingDay> findByDayOfWeek(DayOfWeek dayOfWeek);
}