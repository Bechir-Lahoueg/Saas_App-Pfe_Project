package com.example.ClientBooking_service.config;

import com.example.ClientBooking_service.context.TenantContext;
import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ScheduleFeignConfig {

    @Bean
    public RequestInterceptor tenantInterceptor() {
        return requestTemplate -> {
            // Extract from ThreadLocal (populated by your Gateway or a filter)
            String tenantId = TenantContext.getCurrentTenant();
            if (tenantId != null) {
                requestTemplate.header("X-Tenant-ID", tenantId);
            }
        };
    }
}

