package com.example.ClientBooking_service.DTO;

import java.time.LocalTime;

public record TimeSlotDto(LocalTime startTime, LocalTime endTime) {}