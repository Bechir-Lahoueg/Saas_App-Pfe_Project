package com.example.reporting_service.events;

import java.time.Instant;

public record CategoryCreatedEvent(
        Long   categoryId,
        String categoryName,
        Instant timestamp
) {}