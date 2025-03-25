package com.example.Schedule_Service.service;

import com.example.Schedule_Service.entities.ExceptionTimeBlock;
import com.example.Schedule_Service.repository.ExceptionTimeBlockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExceptionTimeBlockService {
    private final ExceptionTimeBlockRepository exceptionTimeBlockRepository;

    public List<ExceptionTimeBlock> getAllExceptionTimeBlocks() {
        return exceptionTimeBlockRepository.findAll();
    }

    public Optional<ExceptionTimeBlock> getExceptionTimeBlockById(UUID id) {
        return exceptionTimeBlockRepository.findById(id);
    }

    public List<ExceptionTimeBlock> getExceptionTimeBlocksByScheduleExceptionId(UUID scheduleExceptionId) {
        return exceptionTimeBlockRepository.findByScheduleExceptionId(scheduleExceptionId);
    }

    @Transactional
    public ExceptionTimeBlock createExceptionTimeBlock(ExceptionTimeBlock exceptionTimeBlock) {
        return exceptionTimeBlockRepository.save(exceptionTimeBlock);
    }

    @Transactional
    public ExceptionTimeBlock updateExceptionTimeBlock(ExceptionTimeBlock exceptionTimeBlock) {
        return exceptionTimeBlockRepository.save(exceptionTimeBlock);
    }

    @Transactional
    public void deleteExceptionTimeBlock(UUID id) {
        exceptionTimeBlockRepository.deleteById(id);
    }
}