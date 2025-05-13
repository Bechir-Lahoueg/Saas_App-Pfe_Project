package com.example.api_gateway.Validators;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    public static final List<String> unprotectedUrls = List.of(

            //AUTH SERVICE PUBLIC ROUTES
            "/auth/tenant/forgot-password",
            "/auth/tenant/forgot-password/**",
            "/auth/tenant/reset-password/**",
            "/auth/tenant/reset-password",
            "/auth/category/getall",
            "/auth/admin/login",
            "/auth/tenant/login",
            "/auth/tenant/getTenantByCategory",
            "/auth/tenant/getTenantBySubdomain",
            "/auth/tenant/check-email",
            "/auth/tenant/check-subdomain",

            //REGISTER SERVICE PUBLIC ROUTES
            "/register/tenant/signup",

            //SCHEDULE SERVICE PUBLIC ROUTES
            "/schedule/working-day/getall",
            "/schedule/service/getall",
            "/schedule/employee/getall",
            "/schedule/reservation/getall",
            "/schedule/media",
            "/schedule/reservation/client/create",
            "/schedule/reservation/client/confirm",


            //BOOKING SERVICE PUBLIC ROUTES
            "/booking/client/reservation/getAvailability",
            "/booking/client/reservation/create"
    );

    public Predicate<ServerHttpRequest> isSecured = request -> unprotectedUrls.stream().noneMatch(uri -> request.getURI().getPath().contains(uri));

}
