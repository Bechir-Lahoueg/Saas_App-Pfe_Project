package com.example.register_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TenantDTO {
    private Long id;
    private String tenantId;
    private String email;
    private String firstName;
    private String lastName;
    private String businessName;
    private String subdomain;

}