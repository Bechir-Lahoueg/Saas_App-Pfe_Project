package org.example.tenant.config;

import org.example.tenant.client.TenantDatabaseClient;
import org.example.tenant.context.TenantContext;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Configuration for dynamic tenant-aware data sources
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSourceConfig {

    private final TenantDatabaseClient databaseClient;

    /**
     * Creates a tenant-aware routing data source
     *
     * @return The configured data source
     */
    @Bean
    @Primary
    public DataSource dataSource() {
        log.info("Initializing tenant-aware routing data source");
        RoutingDataSource routingDataSource = new RoutingDataSource(databaseClient);
        routingDataSource.setTargetDataSources(new HashMap<>());
        routingDataSource.setLenientFallback(false);
        return routingDataSource;
    }

    /**
     * Custom AbstractRoutingDataSource implementation that determines
     * the current data source based on the tenant context
     */
    public static class RoutingDataSource extends AbstractRoutingDataSource {

        private final TenantDatabaseClient databaseClient;
        private final Map<String, DataSource> resolvedDataSources = new ConcurrentHashMap<>();

        public RoutingDataSource(TenantDatabaseClient databaseClient) {
            this.databaseClient = databaseClient;
        }

        @Override
        protected Object determineCurrentLookupKey() {
            String tenantId = TenantContext.getCurrentTenant();
            if (tenantId == null) {
                log.warn("No tenant found in context, data source lookup will fail");
            } else {
                log.debug("Looking up data source for tenant: {}", tenantId);
            }
            return tenantId;
        }

        @Override
        protected DataSource determineTargetDataSource() {
            String tenantId = TenantContext.getCurrentTenant();

            if (tenantId == null) {
                throw new IllegalStateException("No tenant ID found in context");
            }

            return resolvedDataSources.computeIfAbsent(tenantId, id -> {
                log.info("Creating new datasource for tenant: {}", id);
                Map<String, String> config = databaseClient.getDatabaseConfig(id);
                return createDataSource(config.get("connectionString"));
            });
        }

        private DataSource createDataSource(String connectionString) {
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(connectionString);
            // You can set more properties here, or from the fetched configuration
            config.setUsername("neondb_owner");
            config.setMinimumIdle(2);
            config.setMaximumPoolSize(5);
            return new HikariDataSource(config);
        }
    }
}