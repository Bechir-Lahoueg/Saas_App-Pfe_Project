package com.example.auth_service.entities;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseSubscriber {
    private String accessToken;
    private String refreshToken;
    private Subscriber subscriber;

}
