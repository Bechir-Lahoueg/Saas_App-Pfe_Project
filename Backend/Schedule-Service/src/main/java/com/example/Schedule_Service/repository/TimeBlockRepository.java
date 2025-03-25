package com.example.Schedule_Service.repository;

import com.example.Schedule_Service.entities.TimeBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TimeBlockRepository extends JpaRepository<TimeBlock, UUID> {
    List<TimeBlock> findByDailyScheduleId(UUID dailyScheduleId);

    @Query("SELECT tb FROM TimeBlock tb WHERE tb.dailySchedule.id = ?1 AND " +
            "((tb.startTime <= ?2 AND tb.endTime > ?2) OR " +
            "(tb.startTime < ?3 AND tb.endTime >= ?3) OR " +
            "(tb.startTime >= ?2 AND tb.endTime <= ?3))")
    List<TimeBlock> findOverlappingTimeBlocks(UUID dailyScheduleId, LocalTime startTime, LocalTime endTime);
}