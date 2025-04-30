package com.example.ClientBooking_service.service;

import com.example.ClientBooking_service.DTO.AvailabilityDto;
import com.example.ClientBooking_service.DTO.CreateReservationRequest;
import com.example.ClientBooking_service.DTO.ReservationDto;
import com.example.ClientBooking_service.feign.ScheduleClient;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class BookingService {

    @Autowired
    private final ScheduleClient schedule;

    public AvailabilityDto fetchAvailability() {
        var days  = schedule.getWorkingDays(null);
        var svcs  = schedule.getServices(null);
        var emps  = schedule.getEmployees(null);
        var resvs = schedule.getReservations(null);
        var media = schedule.getMedia(null);
        return new AvailabilityDto(days, svcs, emps, resvs, media);
    }

    public ReservationDto makeReservation(CreateReservationRequest req) {
        return schedule.createReservation(null, req);
    }
}

