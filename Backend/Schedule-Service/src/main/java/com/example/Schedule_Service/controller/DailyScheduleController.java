package com.example.Schedule_Service.controller;

import com.example.Schedule_Service.entities.DailySchedule;
import com.example.Schedule_Service.service.DailyScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/daily-schedule")
@RequiredArgsConstructor

public class DailyScheduleController {
    private final DailyScheduleService dailyScheduleService;

    @GetMapping("/getall")
    public ResponseEntity<List<DailySchedule>> getAllDailySchedules() {
        return ResponseEntity.ok(dailyScheduleService.getAllDailySchedules());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<DailySchedule> getDailyScheduleById(@PathVariable UUID id) {
        return dailyScheduleService.getDailyScheduleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/weekly-schedule/{weeklyScheduleId}")
    public ResponseEntity<List<DailySchedule>> getDailySchedulesByWeeklyScheduleId(@PathVariable UUID weeklyScheduleId) {
        return ResponseEntity.ok(dailyScheduleService.getDailySchedulesByWeeklyScheduleId(weeklyScheduleId));
    }

    @GetMapping("/weekly-schedule/{weeklyScheduleId}/day/{dayOfWeek}")
    public ResponseEntity<DailySchedule> getDailyScheduleByWeeklyScheduleIdAndDayOfWeek(
            @PathVariable UUID weeklyScheduleId,
            @PathVariable DayOfWeek dayOfWeek) {
        return dailyScheduleService.getDailyScheduleByWeeklyScheduleIdAndDayOfWeek(weeklyScheduleId, dayOfWeek)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<DailySchedule> createDailySchedule(@RequestBody DailySchedule dailySchedule) {
        return new ResponseEntity<>(dailyScheduleService.createDailySchedule(dailySchedule), HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<DailySchedule> updateDailySchedule(@PathVariable UUID id, @RequestBody DailySchedule dailySchedule) {
        if (!id.equals(dailySchedule.getId())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(dailyScheduleService.updateDailySchedule(dailySchedule));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteDailySchedule(@PathVariable UUID id) {
        dailyScheduleService.deleteDailySchedule(id);
        return ResponseEntity.noContent().build();
    }
}