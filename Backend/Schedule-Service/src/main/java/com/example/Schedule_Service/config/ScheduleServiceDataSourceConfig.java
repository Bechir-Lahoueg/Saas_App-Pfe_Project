package com.example.Schedule_Service.config;

import org.example.tenant.properties.TenantRoutingProperties;
import org.example.tenant.datasource.TenantAwareDataSource;

import javax.sql.DataSource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;



@Configuration
@EnableConfigurationProperties(TenantRoutingProperties.class)
public class ScheduleServiceDataSourceConfig {

    @Bean
    @Primary
    @ConditionalOnProperty(name = "tenant.routing.enabled", havingValue = "true")
    public DataSource tenantRoutingDataSource(TenantRoutingProperties properties) {
        // The tenant-routing library will configure the data source
        return new TenantAwareDataSource(properties);
    }

    // For testing with a fixed connection when needed
    @Bean
    @ConditionalOnProperty(name = "tenant.routing.enabled", havingValue = "false")
    public DataSource defaultDataSource() {
        return DataSourceBuilder.create()
                .url("jdbc:postgresql://localhost:5432/default_db")
                .username("postgres")
                .password("your_correct_password")
                .build();
    }
}
