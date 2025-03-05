package com.example.api_gateway.configuration;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;

public class GatewayConfiguration {
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("register-service", r -> r
                        .path("/register/**")
                        .filters(f -> f
                                .removeRequestHeader("Origin")
                                .removeRequestHeader("Access-Control-Request-Method")
                                .removeRequestHeader("Access-Control-Request-Headers")
                                .addResponseHeader("Access-Control-Allow-Origin", "*")
                                .addResponseHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
                                .addResponseHeader("Access-Control-Allow-Headers", "*")
                        )
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

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(csrf -> csrf.disable())  // Disable CSRF for API endpoints
                .build();
    }
}
