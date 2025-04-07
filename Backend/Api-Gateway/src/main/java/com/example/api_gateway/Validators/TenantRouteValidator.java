package com.example.api_gateway.Validators;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class TenantRouteValidator {
    public static final List<String> noTenantUrls = List.of(
            "/auth/tenant/login",
            "/auth/admin/login"
    );

    public Predicate<ServerHttpRequest> requiresTenant = request ->
            noTenantUrls.stream().noneMatch(uri ->
                    request.getURI().getPath().contains(uri));
}