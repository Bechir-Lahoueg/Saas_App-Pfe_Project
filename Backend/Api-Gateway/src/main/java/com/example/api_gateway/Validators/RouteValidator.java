package com.example.api_gateway.Validators;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    public static final List<String> unprotectedUrls = List.of(
            "/auth/tenant/forgot-password",
            "/auth/tenant/reset-password",
            "/auth/admin/login",
            "/auth/tenant/login",
            "/register/tenant/signup"
    );

    public Predicate<ServerHttpRequest> isSecured = request -> unprotectedUrls.stream().noneMatch(uri -> request.getURI().getPath().contains(uri));

}
