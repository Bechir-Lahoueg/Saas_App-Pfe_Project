package com.example.auth_service.dto;

import com.example.auth_service.entities.Admin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseAdmin {

        private String accessToken;
        private String refreshToken;
        private Admin admin;


    }
