package com.example.Schedule_Service.events;

import java.time.LocalDateTime;

public record ReservationCreatedEvent(
        Long reservationId,
        String clientEmail,
        String clientPhoneNumber,
        String confirmationCode,
        LocalDateTime startTime
) {}