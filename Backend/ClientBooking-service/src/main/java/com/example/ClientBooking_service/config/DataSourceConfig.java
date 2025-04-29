package com.example.ClientBooking_service.config;

import com.example.ClientBooking_service.routing.MultitenantDataSource;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    // A concurrent map to store target datasources
    private final Map<Object, Object> dataSources = new ConcurrentHashMap<>();

    // Hold a reference to our routing datasource
    private MultitenantDataSource routingDataSource;

    @Bean
    public DataSource dataSource() throws Exception {
        routingDataSource = new MultitenantDataSource();

        // Create and add the default tenant (tenant1)
        DataSource defaultDataSource = createDataSource("saas_app");
        dataSources.put("saas_app", defaultDataSource);

        routingDataSource.setTargetDataSources(dataSources);
        routingDataSource.setDefaultTargetDataSource(defaultDataSource);
        routingDataSource.afterPropertiesSet();

        return routingDataSource;
    }

    // Utility method to create a new datasource for a given tenant DB name.
    public DataSource createDataSource(String tenantDbName) throws Exception {
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("jdbc:postgresql://localhost:5432/" + tenantDbName);
        ds.setUsername(username);
        ds.setPassword(password);
        ds.setDriverClassName("org.postgresql.Driver");

        // Test the connection to verify database exists
        try {
            ds.getConnection().close();
            log.info("Successfully created datasource for tenant: {}", tenantDbName);
        } catch (Exception e) {
            log.error("Tenant database not found or inaccessible: {}", tenantDbName);
            throw new Exception(e);
        }

        return ds;
    }

    // Called dynamically when a tenant is not yet in the map.
    public void addDataSourceIfMissing(String tenantId) throws Exception {
        if (!dataSources.containsKey(tenantId)) {
            DataSource ds = createDataSource(tenantId);
            log.info("Missing datasource config for Tenant :" + tenantId);
            log.info("Adding the missing datasource for tenant: " + tenantId);
            dataSources.put(tenantId, ds);
            // Use the existing routingDataSource instance instead of calling dataSource() again.
            routingDataSource.setTargetDataSources(new HashMap<>(dataSources));
            routingDataSource.afterPropertiesSet();
        }
    }
}
