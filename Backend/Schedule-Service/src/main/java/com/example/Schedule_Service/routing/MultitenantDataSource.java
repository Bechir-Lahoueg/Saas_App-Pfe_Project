package com.example.Schedule_Service.routing;

import com.example.Schedule_Service.context.TenantContext;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

public class MultitenantDataSource extends AbstractRoutingDataSource {

    @Override
    protected String determineCurrentLookupKey() {
        return TenantContext.getCurrentTenant();
    }
}