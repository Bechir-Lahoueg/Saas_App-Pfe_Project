package com.example.ClientBooking_service.controller;

import com.example.ClientBooking_service.DTO.AvailabilityDto;
import com.example.ClientBooking_service.DTO.CreateReservationRequest;
import com.example.ClientBooking_service.DTO.ReservationDto;
import com.example.ClientBooking_service.service.BookingService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/client/reservation")
public class BookingController {
    @Autowired
    private final BookingService booking;

    @GetMapping("/getAvailability")
    public AvailabilityDto availability() {
        return booking.fetchAvailability();
    }

    @PostMapping("/create")
    public ReservationDto book(@RequestBody CreateReservationRequest req) {
        return booking.makeReservation(req);
    }
}
