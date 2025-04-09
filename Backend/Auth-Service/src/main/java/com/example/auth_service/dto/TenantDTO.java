package com.example.auth_service.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class TenantDTO {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String businessName;
    private String subdomain;
    private String address;
    private String phone;
    private String zipcode;
    private String country;
    private String city;

}