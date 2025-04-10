package com.example.notification_service.config;

import com.example.notification_service.service.TenantDatabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Configuration
public class DataSourceConfig {

    @Autowired
    private TenantDatabaseService tenantDatabaseService;

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource defaultDataSource() {
        return new DriverManagerDataSource();
    }

    @Bean
    @Primary
    public DataSource dataSource() {
        TenantAwareRoutingDataSource routingDataSource = new TenantAwareRoutingDataSource();

        Map<Object, Object> dataSources = new HashMap<>();
        tenantDatabaseService.getAllTenantDatabases().forEach((tenantId, connectionString) -> {
            DriverManagerDataSource dataSource = new DriverManagerDataSource();
            dataSource.setUrl(connectionString);
            dataSource.setUsername("neondb_owner");
            dataSource.setPassword("npg_2CPyrate1KLs");
            dataSources.put(tenantId, dataSource);
        });

        routingDataSource.setDefaultTargetDataSource(defaultDataSource());
        routingDataSource.setTargetDataSources(dataSources);
        routingDataSource.afterPropertiesSet();

        return routingDataSource;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource());
        em.setPackagesToScan("com.example.notification_service.entities");

        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);

        Properties properties = new Properties();
        properties.setProperty("hibernate.hbm2ddl.auto", "update");
        properties.setProperty("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        properties.setProperty("hibernate.show_sql", "true");
        em.setJpaProperties(properties);

        return em;
    }

    @Bean
    public JpaTransactionManager transactionManager() {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactory().getObject());
        return transactionManager;
    }
}