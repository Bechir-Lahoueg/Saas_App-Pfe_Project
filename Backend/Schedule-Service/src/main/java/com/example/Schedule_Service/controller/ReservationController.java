package com.example.Schedule_Service.controller;

import com.example.Schedule_Service.entities.Reservation;
import com.example.Schedule_Service.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservation")
public class ReservationController {
    @Autowired
    private ReservationService reservationService;

    // Get all reservations
    @GetMapping("/getall")
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    // Get a reservation by ID
    @GetMapping("/get/{id}")
    public Reservation getReservation(@PathVariable Long id) {
        return reservationService.getReservation(id);
    }

    // Create a new reservation
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public Reservation createReservation(@RequestBody Reservation reservation) {
        return reservationService.createReservation(reservation);
    }

    // Update an existing reservation
    @PutMapping("/update/{id}")
    public Reservation updateReservation(@PathVariable Long id, @RequestBody Reservation reservation) {
        return reservationService.updateReservation(id, reservation);
    }

    // Delete a reservation
    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
    }
}