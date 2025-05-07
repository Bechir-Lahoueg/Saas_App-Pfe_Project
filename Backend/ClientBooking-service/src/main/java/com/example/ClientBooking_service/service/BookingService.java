package com.example.ClientBooking_service.service;

import com.example.ClientBooking_service.DTO.AvailabilityDto;
import com.example.ClientBooking_service.DTO.CreateReservationRequest;
import com.example.ClientBooking_service.DTO.ReservationDto;
//import com.example.ClientBooking_service.config.RabbitConfig;
//import com.example.ClientBooking_service.events.ReservationConfirmedEvent;
//import com.example.ClientBooking_service.events.ReservationCreatedEvent;
import com.example.ClientBooking_service.feign.ScheduleClient;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class BookingService {

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

    @Transactional
    public void confirm(Long id, String code) {
        schedule.confirmReservation(null, id, code);

    }

}
