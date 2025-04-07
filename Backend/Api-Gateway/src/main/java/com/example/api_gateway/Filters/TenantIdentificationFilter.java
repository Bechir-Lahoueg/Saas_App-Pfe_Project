package com.example.api_gateway.Filters;

import com.example.api_gateway.Validators.TenantRouteValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class TenantIdentificationFilter implements GatewayFilter {
    @Autowired
    private TenantRouteValidator tenantRouteValidator;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        // Skip tenant identification for public routes
        if (!tenantRouteValidator.requiresTenant.test(request)) {
            return chain.filter(exchange);
        }

        // Existing tenant identification logic
        String tenantId = null;
        if (exchange.getAttributes().containsKey("subdomain")) {
            tenantId = exchange.getAttributes().get("subdomain").toString();
            log.debug("Tenant ID extracted from subdomain: {}", tenantId);
        }

        // Add tenant header for downstream services if found
        if (tenantId != null) {
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-Tenant-ID", tenantId)
                    .build();
            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        }

        return chain.filter(exchange);
    }
}