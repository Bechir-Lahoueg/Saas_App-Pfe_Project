package com.example.api_gateway.Validators;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    public static final List<String> unprotectedUrls = List.of(
            "/auth/subscriber/login",
            "/auth/subscriber/register",
            "/auth/forgot-password",
            "/auth/reset-password",
            "/auth/admin/login"
    );

    public Predicate<ServerHttpRequest> isSecured = request -> unprotectedUrls.stream().noneMatch(uri -> request.getURI().getPath().contains(uri));

}
