package com.example.notification_service.events;

import java.time.LocalDateTime;

public record ReservationCreatedEvent(
        Long reservationId,
        String clientEmail,
        String clientPhoneNumber,
        String confirmationCode,
        LocalDateTime startTime,
        Status status
) {
    /** Convenience ctor: defaults status → PENDING **/
    public ReservationCreatedEvent(
            Long reservationId,
            String clientEmail,
            String clientPhoneNumber,
            String confirmationCode,
            LocalDateTime startTime
    ) {
        this(reservationId, clientEmail, clientPhoneNumber, confirmationCode, startTime, Status.PENDING);
    }

    public enum Status {
        PENDING,
        CONFIRMED
    }
}
