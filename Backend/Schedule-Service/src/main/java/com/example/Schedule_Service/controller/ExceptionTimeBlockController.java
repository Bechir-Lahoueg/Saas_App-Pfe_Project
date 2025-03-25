package com.example.Schedule_Service.controller;

import com.example.Schedule_Service.entities.ExceptionTimeBlock;
import com.example.Schedule_Service.service.ExceptionTimeBlockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/exception-time-block")
@RequiredArgsConstructor
public class ExceptionTimeBlockController {
    private final ExceptionTimeBlockService exceptionTimeBlockService;

    @GetMapping("/getall")
    public ResponseEntity<List<ExceptionTimeBlock>> getAllExceptionTimeBlocks() {
        return ResponseEntity.ok(exceptionTimeBlockService.getAllExceptionTimeBlocks());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ExceptionTimeBlock> getExceptionTimeBlockById(@PathVariable UUID id) {
        return exceptionTimeBlockService.getExceptionTimeBlockById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/schedule-exception/{scheduleExceptionId}")
    public ResponseEntity<List<ExceptionTimeBlock>> getExceptionTimeBlocksByScheduleExceptionId(@PathVariable UUID scheduleExceptionId) {
        return ResponseEntity.ok(exceptionTimeBlockService.getExceptionTimeBlocksByScheduleExceptionId(scheduleExceptionId));
    }

    @PostMapping("/create")
    public ResponseEntity<ExceptionTimeBlock> createExceptionTimeBlock(@RequestBody ExceptionTimeBlock exceptionTimeBlock) {
        return new ResponseEntity<>(exceptionTimeBlockService.createExceptionTimeBlock(exceptionTimeBlock), HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ExceptionTimeBlock> updateExceptionTimeBlock(@PathVariable UUID id, @RequestBody ExceptionTimeBlock exceptionTimeBlock) {
        if (!id.equals(exceptionTimeBlock.getId())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(exceptionTimeBlockService.updateExceptionTimeBlock(exceptionTimeBlock));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteExceptionTimeBlock(@PathVariable UUID id) {
        exceptionTimeBlockService.deleteExceptionTimeBlock(id);
        return ResponseEntity.noContent().build();
    }
}