//package com.example.Schedule_Service.controller;
//
//import com.example.Schedule_Service.entities.TimeBlock;
//import com.example.Schedule_Service.service.TimeBlockService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.time.LocalTime;
//import java.util.List;
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/time-block")
//@RequiredArgsConstructor
//public class TimeBlockController {
//    private final TimeBlockService timeBlockService;
//
//    @GetMapping("/getall")
//    public ResponseEntity<List<TimeBlock>> getAllTimeBlocks() {
//        return ResponseEntity.ok(timeBlockService.getAllTimeBlocks());
//    }
//
//    @GetMapping("/get/{id}")
//    public ResponseEntity<TimeBlock> getTimeBlockById(@PathVariable UUID id) {
//        return timeBlockService.getTimeBlockById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    @GetMapping("/daily-schedule/{dailyScheduleId}")
//    public ResponseEntity<List<TimeBlock>> getTimeBlocksByDailyScheduleId(@PathVariable UUID dailyScheduleId) {
//        return ResponseEntity.ok(timeBlockService.getTimeBlocksByDailyScheduleId(dailyScheduleId));
//    }
//
//    @GetMapping("/overlapping")
//    public ResponseEntity<List<TimeBlock>> findOverlappingTimeBlocks(
//            @RequestParam UUID dailyScheduleId,
//            @RequestParam LocalTime startTime,
//            @RequestParam LocalTime endTime) {
//        return ResponseEntity.ok(timeBlockService.findOverlappingTimeBlocks(dailyScheduleId, startTime, endTime));
//    }
//
//    @PostMapping("/create")
//    public ResponseEntity<TimeBlock> createTimeBlock(@RequestBody TimeBlock timeBlock) {
//        return new ResponseEntity<>(timeBlockService.createTimeBlock(timeBlock), HttpStatus.CREATED);
//    }
//
//    @PutMapping("/update/{id}")
//    public ResponseEntity<TimeBlock> updateTimeBlock(@PathVariable UUID id, @RequestBody TimeBlock timeBlock) {
//        if (!id.equals(timeBlock.getId())) {
//            return ResponseEntity.badRequest().build();
//        }
//        return ResponseEntity.ok(timeBlockService.updateTimeBlock(timeBlock));
//    }
//
//    @PatchMapping("/{id}/availability")
//    public ResponseEntity<TimeBlock> updateAvailabilityStatus(
//            @PathVariable UUID id,
//            @RequestParam TimeBlock.AvailabilityStatus status) {
//        return ResponseEntity.ok(timeBlockService.updateAvailabilityStatus(id, status));
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteTimeBlock(@PathVariable UUID id) {
//        timeBlockService.deleteTimeBlock(id);
//        return ResponseEntity.noContent().build();
//    }
//}