package com.example.Schedule_Service.repository;

import com.example.Schedule_Service.entities.ExceptionTimeBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExceptionTimeBlockRepository extends JpaRepository<ExceptionTimeBlock, UUID> {
    List<ExceptionTimeBlock> findByScheduleExceptionId(UUID scheduleExceptionId);
}