package com.example.auth_service.dto;

public record CategoryRankingDto(
        Long   categoryId,
        String categoryName,
        Long   tenantCount
) {}
