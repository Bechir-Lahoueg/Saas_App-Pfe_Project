package com.example.auth_service.dto;

import lombok.Data;

@Data
public class TenantLoginRequest {
    private String email;
    private String password;
}