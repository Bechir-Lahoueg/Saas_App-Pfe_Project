package com.example.api_gateway.Configuration;

import com.example.api_gateway.Filters.AuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Autowired
    private AuthFilter authFilter;

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()

                .route("auth-service", r -> r
                        .path("/auth/**")
                        .filters(f->f.filter(authFilter))
                        .uri("lb://auth-service"))

                .route("register-service", r -> r
                        .path("/register/**")
                        .uri("lb://register-service"))

                .route("reporting-service", r -> r
                        .path("/report/**")
                        .uri("lb://reporting-service"))

                .route("schedule-service", r -> r
                        .path("/schedule/**")
                        .filters(f -> f
                                .filter(authFilter)
                        )
                        .uri("lb://schedule-service"))

                .route("payment-service", r -> r
                        .path("/payment/**")
                        .uri("lb://payment-service"))

                .route("clientbooking-service", r -> r
                        .path("/booking/**")
                        .uri("lb://clientbooking-service"))


                .route("notification-service", r -> r
                        .path("/notification/**")
                        .filters(f->f.filter(authFilter))
                        .uri("lb://notification-service"))

                .build();
    }

}
