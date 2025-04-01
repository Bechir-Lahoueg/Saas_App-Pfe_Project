package org.example.tenant.autoconfigure;

import org.example.tenant.client.TenantDatabaseClient;
import org.example.tenant.config.DataSourceConfig;
import org.example.tenant.config.WebClientConfig;
import org.example.tenant.filter.TenantFilter;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

/**
 * Auto-configuration for the tenant routing library
 * This class automatically configures the tenant routing components
 * when the library is included as a dependency in a Spring Boot application
 */
@AutoConfiguration
@ConditionalOnProperty(name = "tenant.routing.enabled", havingValue = "true", matchIfMissing = true)
@Import({WebClientConfig.class, DataSourceConfig.class})
@ComponentScan(basePackages = "org.example.tenant")
public class TenantAutoConfiguration {

    /**
     * Creates a TenantFilter bean if none exists
     *
     * @return A new TenantFilter
     */
    @Bean
    @ConditionalOnMissingBean
    public TenantFilter tenantFilter() {
        return new TenantFilter();
    }

    /**
     * Creates a TenantDatabaseClient bean if none exists
     *
     * @param webClientBuilder The WebClient.Builder to use
     * @return A new TenantDatabaseClient
     */
    @Bean
    @ConditionalOnMissingBean
    public TenantDatabaseClient tenantDatabaseClient(org.springframework.web.reactive.function.client.WebClient.Builder webClientBuilder) {
        return new TenantDatabaseClient(webClientBuilder);
    }
}