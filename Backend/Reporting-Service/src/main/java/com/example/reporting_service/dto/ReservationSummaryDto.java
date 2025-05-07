package com.example.reporting_service.dto;

public record ReservationSummaryDto(
        long total,
        long confirmed,
        long pending
) {}
