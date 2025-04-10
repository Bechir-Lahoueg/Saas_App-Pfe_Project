// File: Api-Gateway/src/main/java/com/example/api_gateway/filter/TenantSubdomainFilter.java
package com.example.api_gateway.Filters;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

@Component
public class TenantSubdomainFilter extends AbstractGatewayFilterFactory<Object> {

    @Override
    public GatewayFilter apply(Object config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String host = request.getHeaders().getHost().getHostName();

            // Extract subdomain (e.g., subdomain.example.com -> subdomain)
            String subdomain = host.split("\\.")[0];

            // Add subdomain as a custom header
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-Tenant-ID", subdomain)
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        };
    }
}