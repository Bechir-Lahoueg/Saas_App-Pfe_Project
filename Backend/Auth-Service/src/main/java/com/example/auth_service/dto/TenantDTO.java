package com.example.auth_service.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class TenantDTO {
    private UUID id;
    private String tenantId;
    private String email;
    private String firstName;
    private String lastName;
    private String businessName;
    private String subdomain;

}