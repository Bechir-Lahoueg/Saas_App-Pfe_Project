package com.example.Schedule_Service.controller;

import com.example.Schedule_Service.entities.Calendar;
import com.example.Schedule_Service.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/calendar")
@RequiredArgsConstructor
public class CalendarController {
    private final CalendarService calendarService;

    @GetMapping("/getall")
    public ResponseEntity<List<Calendar>> getAllCalendars() {
        return ResponseEntity.ok(calendarService.getAllCalendars());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Calendar> getCalendarById(@PathVariable UUID id) {
        return calendarService.getCalendarById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<Calendar> createCalendar(@RequestBody Calendar calendar) {

        return new ResponseEntity<>(calendarService.createCalendar(calendar), HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Calendar> updateCalendar(@PathVariable UUID id, @RequestBody Calendar calendar) {
        return ResponseEntity.ok(calendarService.updateCalendar(calendar));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCalendar(@PathVariable UUID id) {
        calendarService.deleteCalendar(id);
        return ResponseEntity.noContent().build();
    }
}