package com.example.register_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TenantLoginResponse {
    private String accessToken;
    private String refreshToken;
    private TenantDTO tenant;
}