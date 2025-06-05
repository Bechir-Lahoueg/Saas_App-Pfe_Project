//package com.example.notification_service.routing;
//
//import com.example.notification_service.context.TenantContext;
//import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
//
//public class MultitenantDataSource extends AbstractRoutingDataSource {
//
//    @Override
//    protected String determineCurrentLookupKey() {
//        return TenantContext.getCurrentTenant();
//    }
//}