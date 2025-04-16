//package com.example.Schedule_Service.controller;
//
//import com.example.Schedule_Service.DTO.AvailableSlotDTO;
//import com.example.Schedule_Service.service.AvailableSLotsService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.format.annotation.DateTimeFormat;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.time.LocalDate;
//import java.util.List;
//import java.util.Map;
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/slots")
//@RequiredArgsConstructor
//public class AvailableSlotsController {
//    private final AvailableSLotsService availableSlotsService;
//
//    @GetMapping("/get")
//    public ResponseEntity<Map<LocalDate, List<AvailableSlotDTO>>> getAvailableSlots(
//            @RequestParam UUID calendarId,
//            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
//            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
//            @RequestParam(required = false) UUID serviceId) {
//
//        Map<LocalDate, List<AvailableSlotDTO>> availableSlots =
//                availableSlotsService.findAvailableSlots(calendarId, startDate, endDate, serviceId);
//
//        return ResponseEntity.ok(availableSlots);
//    }
//}