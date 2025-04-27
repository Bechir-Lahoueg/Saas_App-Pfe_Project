package com.example.Schedule_Service.controller;

import com.example.Schedule_Service.entities.TimeSlot;
import com.example.Schedule_Service.entities.WorkingDay;
import com.example.Schedule_Service.service.WorkingDayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/working-day")
public class WorkingDayController {

    private final WorkingDayService workingDayService;


    @GetMapping("/getall")
    public ResponseEntity<List<WorkingDay>> getAllWorkingDays() {
        return ResponseEntity.ok(workingDayService.getAllWorkingDays());
    }
    @GetMapping("/get/{id}")
    public ResponseEntity<WorkingDay> getWorkingDayById(@PathVariable Long id) {
        return workingDayService.getWorkingDayById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/create")
    public ResponseEntity<WorkingDay> createWorkingDay(@RequestBody WorkingDay workingDay) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workingDayService.createWorkingDay(workingDay));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<WorkingDay> updateWorkingDay(@PathVariable Long id, @RequestBody WorkingDay workingDay) {
        return ResponseEntity.ok(workingDayService.updateWorkingDay(id, workingDay));
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteWorkingDay(@PathVariable Long id) {
        workingDayService.deleteWorkingDay(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/addTimeSlot/{id}/time-slot")
    public ResponseEntity<WorkingDay> addTimeSlot(@PathVariable Long id, @RequestBody TimeSlot timeSlot) {
        return workingDayService.addTimeSlotToWorkingDay(id, timeSlot)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/deleteTimeSlot/{id}/time-slot/{index}")
    public ResponseEntity<WorkingDay> removeTimeSlot(@PathVariable Long id, @PathVariable int index) {
        return workingDayService.removeTimeSlotFromWorkingDay(id, index)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}