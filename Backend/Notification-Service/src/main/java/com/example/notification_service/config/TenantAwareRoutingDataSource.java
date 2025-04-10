// File: Notification-Service/src/main/java/com/example/notification_service/config/TenantAwareRoutingDataSource.java
package com.example.notification_service.config;
import com.example.notification_service.tenant.TenantContext;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;


public class TenantAwareRoutingDataSource extends AbstractRoutingDataSource {


    @Override
    protected Object determineCurrentLookupKey() {
        String tenantId = TenantContext.getTenantId();
        System.out.println("Current tenant ID for database routing: " + tenantId);
        return tenantId != null ? tenantId : "default";
}
}