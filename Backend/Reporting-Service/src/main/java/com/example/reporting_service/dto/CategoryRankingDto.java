package com.example.reporting_service.dto;

public record CategoryRankingDto(
        Long   categoryId,
        String categoryName,
        Long   tenantCount
) {}
