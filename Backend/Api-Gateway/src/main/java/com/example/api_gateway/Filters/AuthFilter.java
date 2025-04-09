package com.example.api_gateway.Filters;

import com.example.api_gateway.Validators.RouteValidator;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import com.example.api_gateway.Utils.JWTUtils;

@Component
@RefreshScope
public class AuthFilter implements GatewayFilter {

    @Autowired
    RouteValidator routeValidator;

    @Autowired
    private JWTUtils jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String token ="";
        ServerHttpRequest request = exchange.getRequest();
        System.out.println("validating request");

        if(routeValidator.isSecured.test(request)) {
            System.out.println("validating authentication token");
            if(this.isCredsMissing(request)) {
                System.out.println("in error");
                return this.onError(exchange,"Credentials missing", HttpStatus.UNAUTHORIZED);
            }

            token = request.getHeaders().get("Authorization").toString().split(" ")[1];

            if(jwtUtil.isInvalid(token)) {
                return this.onError(exchange,"Auth header invalid",HttpStatus.UNAUTHORIZED);
            }
            else {
                System.out.println("Authentication is successful");
            }

            this.populateRequestWithHeaders(exchange,token);
        }
        return chain.filter(exchange);
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        return response.setComplete();
    }



    private boolean isCredsMissing(ServerHttpRequest request) {
        return !request.getHeaders().containsKey("Authorization");
    }

    private void populateRequestWithHeaders(ServerWebExchange exchange, String token) {
        Claims claims = jwtUtil.getALlClaims(token);
        exchange.getRequest()
                .mutate()
                .header("id",String.valueOf(claims.get("id")))
                .build();
    }
}
