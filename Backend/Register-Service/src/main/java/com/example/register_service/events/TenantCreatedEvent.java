package com.example.register_service.events;

import java.time.Instant;
import java.util.UUID;

public record TenantCreatedEvent(
        UUID Id,
        Long categoryId,
        Instant timestamp
) {}