package com.example.Schedule_Service.controller;

import com.example.Schedule_Service.entities.Break;
import com.example.Schedule_Service.service.BreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/break")
@RequiredArgsConstructor
public class BreakController {
    private final BreakService BreakService;

    @GetMapping("/getall")
    public ResponseEntity<List<Break>> getAllBreaks() {
        return ResponseEntity.ok(BreakService.getAllBreaks());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Break> getBreakById(@PathVariable UUID id) {
        return BreakService.getBreakById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/calendar/{calendarId}")
    public ResponseEntity<List<Break>> getBreaksByCalendar(
            @PathVariable UUID calendarId,
            @RequestParam(defaultValue = "true") boolean activeOnly) {
        return ResponseEntity.ok(BreakService.getBreaksByCalendar(calendarId, activeOnly));
    }

    @GetMapping("/calendar/{calendarId}/day/{dayOfWeek}")
    public ResponseEntity<List<Break>> getBreaksByCalendarAndDay(
            @PathVariable UUID calendarId,
            @PathVariable DayOfWeek dayOfWeek) {
        return ResponseEntity.ok(BreakService.getBreaksByCalendarAndDay(calendarId, dayOfWeek));
    }

    @PostMapping("/create")
    public ResponseEntity<Break> createBreak(@RequestBody Break Break) {
        return new ResponseEntity<>(BreakService.createBreak(Break), HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Break> updateBreak(@PathVariable UUID id, @RequestBody Break Break) {
        if (!id.equals(Break.getId())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(BreakService.updateBreak(Break));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBreak(@PathVariable UUID id) {
        BreakService.deleteBreak(id);
        return ResponseEntity.noContent().build();
    }
}