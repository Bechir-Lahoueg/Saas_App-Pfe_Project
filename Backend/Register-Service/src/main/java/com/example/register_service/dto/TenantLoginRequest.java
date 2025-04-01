package com.example.register_service.dto;

import lombok.Data;

@Data
public class TenantLoginRequest {
    private String email;
    private String password;
}