package com.example.Schedule_Service.controller;

import com.example.Schedule_Service.entities.ScheduleException;
import com.example.Schedule_Service.service.ScheduleExceptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/schedule-exception")
@RequiredArgsConstructor
public class ScheduleExceptionController {
    private final ScheduleExceptionService scheduleExceptionService;

    @GetMapping("/getall")
    public ResponseEntity<List<ScheduleException>> getAllScheduleExceptions() {
        return ResponseEntity.ok(scheduleExceptionService.getAllScheduleExceptions());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ScheduleException> getScheduleExceptionById(@PathVariable UUID id) {
        return scheduleExceptionService.getScheduleExceptionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/calendar/{calendarId}")
    public ResponseEntity<List<ScheduleException>> getScheduleExceptionsByCalendarId(@PathVariable UUID calendarId) {
        return ResponseEntity.ok(scheduleExceptionService.getScheduleExceptionsByCalendarId(calendarId));
    }

    @GetMapping("/calendar/{calendarId}/date")
    public ResponseEntity<ScheduleException> getScheduleExceptionByCalendarIdAndDate(
            @PathVariable UUID calendarId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return scheduleExceptionService.getScheduleExceptionByCalendarIdAndDate(calendarId, date)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/calendar/{calendarId}/date-range")
    public ResponseEntity<List<ScheduleException>> getScheduleExceptionsByCalendarIdAndDateRange(
            @PathVariable UUID calendarId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(
                scheduleExceptionService.getScheduleExceptionsByCalendarIdAndDateRange(calendarId, startDate, endDate));
    }

    @PostMapping("/create")
    public ResponseEntity<ScheduleException> createScheduleException(@RequestBody ScheduleException scheduleException) {
        return new ResponseEntity<>(scheduleExceptionService.createScheduleException(scheduleException), HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ScheduleException> updateScheduleException(@PathVariable UUID id, @RequestBody ScheduleException scheduleException) {
        if (!id.equals(scheduleException.getId())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(scheduleExceptionService.updateScheduleException(scheduleException));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteScheduleException(@PathVariable UUID id) {
        scheduleExceptionService.deleteScheduleException(id);
        return ResponseEntity.noContent().build();
    }
}