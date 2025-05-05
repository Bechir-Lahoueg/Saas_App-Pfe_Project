package com.example.Schedule_Service.events;

public record ReservationConfirmedEvent(
        Long reservationId
        // you can add more fields if you like
) {}