package com.example.ClientBooking_service.DTO;

import java.time.LocalDateTime;

public record ReservationDto(
        Long id,
        Long serviceId,
        Long employeeId,
        LocalDateTime startTime,
        LocalDateTime endTime,
        int numberOfAttendees
) {}