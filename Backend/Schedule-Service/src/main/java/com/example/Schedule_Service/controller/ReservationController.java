//package com.example.Schedule_Service.controller;
//
//import com.example.Schedule_Service.DTO.ReservationRequestDTO;
//import com.example.Schedule_Service.entities.Reservation;
//import com.example.Schedule_Service.service.ReservationService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.format.annotation.DateTimeFormat;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/api/reservations")
//@RequiredArgsConstructor
//public class ReservationController {
//    private final ReservationService reservationService;
//
//    @GetMapping
//    public ResponseEntity<List<Reservation>> getAllReservations() {
//        return ResponseEntity.ok(reservationService.getAllReservations());
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<Reservation> getReservationById(@PathVariable UUID id) {
//        return reservationService.getReservationById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    @GetMapping("/calendar/{calendarId}")
//    public ResponseEntity<List<Reservation>> getReservationsByCalendarId(@PathVariable UUID calendarId) {
//        return ResponseEntity.ok(reservationService.getReservationsByCalendarId(calendarId));
//    }
//
//    @GetMapping("/timeblock/{timeBlockId}")
//    public ResponseEntity<List<Reservation>> getReservationsByTimeBlockId(@PathVariable UUID timeBlockId) {
//        return ResponseEntity.ok(reservationService.getReservationsByTimeBlockId(timeBlockId));
//    }
//
//    @GetMapping("/calendar/{calendarId}/range")
//    public ResponseEntity<List<Reservation>> getReservationsByDateRange(
//            @PathVariable UUID calendarId,
//            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
//            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
//        return ResponseEntity.ok(reservationService.getReservationsByDateRange(calendarId, start, end));
//    }
//
//    @PostMapping
//    public ResponseEntity<Reservation> createReservation(@RequestBody ReservationRequestDTO requestDTO) {
//        return new ResponseEntity<>(reservationService.createReservation(requestDTO), HttpStatus.CREATED);
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<Reservation> updateReservation(@PathVariable UUID id, @RequestBody Reservation reservation) {
//        if (!id.equals(reservation.getId())) {
//            return ResponseEntity.badRequest().build();
//        }
//        return ResponseEntity.ok(reservationService.updateReservation(reservation));
//    }
//
////    @PatchMapping("/{id}/status")
////    public ResponseEntity<Reservation> updateReservationStatus(
////            @PathVariable UUID id,
////            @RequestParam Reservation.ReservationStatus status) {
////        return ResponseEntity.ok(reservationService.updateReservationStatus(id, status));
////    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteReservation(@PathVariable UUID id) {
//        reservationService.deleteReservation(id);
//        return ResponseEntity.noContent().build();
//    }
//}