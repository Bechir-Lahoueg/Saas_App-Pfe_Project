package com.example.Schedule_Service.controller;

import com.example.Schedule_Service.entities.WeeklySchedule;
import com.example.Schedule_Service.service.WeeklyScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/weekly-schedule")
@RequiredArgsConstructor
public class WeeklyScheduleController {
    private final WeeklyScheduleService weeklyScheduleService;

    @GetMapping("/getall")
    public ResponseEntity<List<WeeklySchedule>> getAllWeeklySchedules() {
        return ResponseEntity.ok(weeklyScheduleService.getAllWeeklySchedules());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<WeeklySchedule> getWeeklyScheduleById(@PathVariable UUID id) {
        return weeklyScheduleService.getWeeklyScheduleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/calendar-weeklyschedule/{calendarId}")
    public ResponseEntity<List<WeeklySchedule>> getWeeklySchedulesByCalendarId(@PathVariable UUID calendarId) {
        return ResponseEntity.ok(weeklyScheduleService.getWeeklySchedulesByCalendarId(calendarId));
    }

    @GetMapping("/calendar/{calendarId}/active")
    public ResponseEntity<List<WeeklySchedule>> getActiveWeeklySchedulesByCalendarId(@PathVariable UUID calendarId) {
        return ResponseEntity.ok(weeklyScheduleService.getActiveWeeklySchedulesByCalendarId(calendarId));
    }

    @PostMapping("/create")
    public ResponseEntity<WeeklySchedule> createWeeklySchedule(@RequestBody WeeklySchedule weeklySchedule) {
        return new ResponseEntity<>(weeklyScheduleService.createWeeklySchedule(weeklySchedule), HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<WeeklySchedule> updateWeeklySchedule(@PathVariable UUID id, @RequestBody WeeklySchedule weeklyScheduleRequest) {
        return weeklyScheduleService.getWeeklyScheduleById(id)
                .map(existingSchedule -> {
                    // Update only the fields that should change
                    existingSchedule.setName(weeklyScheduleRequest.getName());
                    existingSchedule.setActive(weeklyScheduleRequest.isActive());
                    existingSchedule.setCalendar(weeklyScheduleRequest.getCalendar());
                    // Keep existing relationships intact
                    return ResponseEntity.ok(weeklyScheduleService.updateWeeklySchedule(existingSchedule));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteWeeklySchedule(@PathVariable UUID id) {
        weeklyScheduleService.deleteWeeklySchedule(id);
        return ResponseEntity.noContent().build();
    }
}