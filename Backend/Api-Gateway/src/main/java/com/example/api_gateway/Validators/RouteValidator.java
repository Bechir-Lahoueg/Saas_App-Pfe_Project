package com.example.api_gateway.Validators;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    public static final List<String> unprotectedUrls = List.of(

            // AUTH SERVICE PUBLIC ROUTES
            "/auth/tenant/forgot-password",
            "/auth/tenant/forgot-password",
            "/auth/tenant/reset-password",
            "/auth/tenant/reset-password",
            "/auth/category/getall",
            "/auth/admin/login",
            "/auth/tenant/login",
            "/auth/tenant/getTenantByCategory",
            "/auth/tenant/getTenantBySubdomain",
            "/auth/tenant/check-email",
            "/auth/tenant/check-subdomain",

            // REGISTER SERVICE PUBLIC ROUTES
            "/register/tenant/signup",

            // SCHEDULE SERVICE PUBLIC ROUTES
            "/schedule/working-day/getall",
            "/schedule/service/getall",
            "/schedule/employee/getall",
            "/schedule/reservation/getall",
            "/schedule/media/getall",
            "/schedule/reservation/client/create",
            "/schedule/reservation/client/confirm",

            // BOOKING SERVICE PUBLIC ROUTES
            "/booking/client/reservation/getAvailability",
            "/booking/client/reservation/create",
            "/booking/client/reservation/confirm/**"


    );

    public static final List<String> adminOnlyUrls = List.of(
            // Add admin-only endpoints here
            "/auth/category/create",
            "/auth/category/update",
            "/auth/category/delete",
            "/auth/category/ranking",
            "/auth/tenant/delete/**",
            "/payment/admin/stats",
            "/payment/admin/payments",
            "/payment/admin/stats/period/**",
            "/payment/admin/stats/stats/payment-methods",
            "/payment/admin/stats/tenant-registrations",
            "/payment/admin/payments/getall",
            "/payment/tenant-registration"


    );

    public static final List<String> tenantOnlyUrls = List.of(
            "/schedule/working-day/create",
            "/schedule/working-day/update",
            "/schedule/working-day/delete",

            "/schedule/service/create",
            "/schedule/service/update",
            "/schedule/service/delete",

            "/schedule/employee/create",
            "/schedule/employee/update",
            "/schedule/employee/delete",

            "/schedule/reservation/create",
            "/schedule/reservation/update",
            "/schedule/reservation/delete",

            "/schedule/media/upload",
            "/schedule/media/delete",
            "/schedule/media/type"

    );

    public static final List<String> sharedUrls = List.of(
    // endpoints accessible by both admin and tenant
            "/auth/tenant/update/**"

    );

    public Predicate<ServerHttpRequest> isSecured = request -> unprotectedUrls.stream()
            .noneMatch(uri -> request.getURI().getPath().contains(uri));

    public Predicate<ServerHttpRequest> isAdminRoute = request -> adminOnlyUrls.stream()
            .anyMatch(uri -> request.getURI().getPath().startsWith(uri));

    public Predicate<ServerHttpRequest> isTenantRoute = request -> tenantOnlyUrls.stream()
            .anyMatch(uri -> request.getURI().getPath().startsWith(uri));

    public Predicate<ServerHttpRequest> isSharedRoute = request -> sharedUrls.stream()
            .anyMatch(uri -> request.getURI().getPath().startsWith(uri));

}
