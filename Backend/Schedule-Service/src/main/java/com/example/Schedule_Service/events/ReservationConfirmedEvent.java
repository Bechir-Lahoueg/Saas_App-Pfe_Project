package com.example.Schedule_Service.events;

import java.time.LocalDateTime;

public record ReservationConfirmedEvent(
        Long reservationId,
        String clientEmail,
        String clientPhoneNumber,
        String confirmationCode,
        LocalDateTime startTime,
        Status status
) {
    public ReservationConfirmedEvent(
            Long reservationId,
            String clientEmail,
            String clientPhoneNumber,
            String confirmationCode,
            LocalDateTime startTime
    ) {
        this(reservationId, clientEmail, clientPhoneNumber, confirmationCode, startTime, Status.CONFIRMED);
    }
    public enum Status {
        PENDING,
        CONFIRMED
    }
}
