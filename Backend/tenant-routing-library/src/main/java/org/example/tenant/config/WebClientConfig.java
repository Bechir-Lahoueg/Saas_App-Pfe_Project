package org.example.tenant.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Configuration for WebClient with load balancing enabled
 */
@Configuration
public class WebClientConfig {

    /**
     * Creates a WebClient.Builder bean with load balancing enabled
     * Only created if no other WebClient.Builder bean exists
     *
     * @return A load-balanced WebClient.Builder
     */
    @Bean
    @LoadBalanced
    @ConditionalOnMissingBean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}