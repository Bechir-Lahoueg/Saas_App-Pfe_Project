package com.example.api_gateway.Configuration;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

public class GatewayConfig {
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("register-service", r -> r
                        .path("/register/**")
                        .uri("lb://register-service"))
                .route("reporting-service", r -> r
                        .path("/reports/**")
                        .uri("lb://reporting-service"))

                .route("auth-service", r -> r
                        .path("/auth/**")
                        .uri("lb://auth-service"))

                .route("bookingandstatistics-service", r -> r
                        .path("/bookingandstatistics/**")
                        .uri("lb://bookingandstatistics-service"))

                .route("payment-service", r -> r
                        .path("/payment/**")
                        .uri("lb://payment-service"))

                .route("clientbooking-service", r -> r
                        .path("/clientbooking/**")
                        .uri("lb://clientbooking-service"))

                .route("integration-service", r -> r
                        .path("/integration/**")
                        .uri("lb://integration-service"))

                .route("notification-service", r -> r
                        .path("/notification/**")
                        .uri("lb://notification-service"))

                .build();
    }

}
