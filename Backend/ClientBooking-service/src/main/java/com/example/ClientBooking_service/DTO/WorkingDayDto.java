package com.example.ClientBooking_service.DTO;

import java.time.DayOfWeek;
import java.util.List;

public record WorkingDayDto(
        Long id,
        DayOfWeek dayOfWeek,
        boolean active,
        List<TimeSlotDto> timeSlots
) {}