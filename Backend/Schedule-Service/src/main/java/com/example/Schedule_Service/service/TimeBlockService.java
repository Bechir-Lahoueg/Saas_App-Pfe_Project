//package com.example.Schedule_Service.service;
//
//import com.example.Schedule_Service.entities.TimeBlock;
//import com.example.Schedule_Service.repository.TimeBlockRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalTime;
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//public class TimeBlockService {
//    private final TimeBlockRepository timeBlockRepository;
//
//    public List<TimeBlock> getAllTimeBlocks() {
//        return timeBlockRepository.findAll();
//    }
//
//    public Optional<TimeBlock> getTimeBlockById(UUID id) {
//        return timeBlockRepository.findById(id);
//    }
//
//    public List<TimeBlock> getTimeBlocksByDailyScheduleId(UUID dailyScheduleId) {
//        return timeBlockRepository.findByDailyScheduleId(dailyScheduleId);
//    }
//
//    public List<TimeBlock> findOverlappingTimeBlocks(UUID dailyScheduleId, LocalTime startTime, LocalTime endTime) {
//        return timeBlockRepository.findOverlappingTimeBlocks(dailyScheduleId, startTime, endTime);
//    }
//
//    @Transactional
//    public TimeBlock createTimeBlock(TimeBlock timeBlock) {
//        return timeBlockRepository.save(timeBlock);
//    }
//
//    @Transactional
//    public TimeBlock updateTimeBlock(TimeBlock timeBlock) {
//        return timeBlockRepository.save(timeBlock);
//    }
//
//    @Transactional
//    public TimeBlock updateAvailabilityStatus(UUID timeBlockId, TimeBlock.AvailabilityStatus status) {
//        TimeBlock timeBlock = timeBlockRepository.findById(timeBlockId)
//                .orElseThrow(() -> new RuntimeException("TimeBlock not found"));
//
//        timeBlock.setAvailabilityStatus(status);
//        return timeBlockRepository.save(timeBlock);
//    }
//
//    @Transactional
//    public void deleteTimeBlock(UUID id) {
//        timeBlockRepository.deleteById(id);
//    }
//}