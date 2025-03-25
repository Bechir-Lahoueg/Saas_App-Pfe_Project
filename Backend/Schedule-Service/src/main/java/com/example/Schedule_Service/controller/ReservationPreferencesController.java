package com.example.Schedule_Service.controller;

import com.example.Schedule_Service.entities.ReservationPreferences;
import com.example.Schedule_Service.service.ReservationPreferencesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reservation-preferences")
@RequiredArgsConstructor
public class ReservationPreferencesController {
    private final ReservationPreferencesService preferencesService;

    @GetMapping
    public ResponseEntity<List<ReservationPreferences>> getAllReservationPreferences() {
        return ResponseEntity.ok(preferencesService.getAllReservationPreferences());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationPreferences> getReservationPreferencesById(@PathVariable UUID id) {
        return preferencesService.getReservationPreferencesById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/subscriber/{subscriberId}")
    public ResponseEntity<ReservationPreferences> getReservationPreferencesBySubscriberId(@PathVariable Long subscriberId) {
        return preferencesService.getReservationPreferencesBySubscriberId(subscriberId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ReservationPreferences> createReservationPreferences(@RequestBody ReservationPreferences preferences) {
        return new ResponseEntity<>(preferencesService.createReservationPreferences(preferences), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationPreferences> updateReservationPreferences(@PathVariable UUID id, @RequestBody ReservationPreferences preferences) {
        if (!id.equals(preferences.getId())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(preferencesService.updateReservationPreferences(preferences));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservationPreferences(@PathVariable UUID id) {
        preferencesService.deleteReservationPreferences(id);
        return ResponseEntity.noContent().build();
    }
}