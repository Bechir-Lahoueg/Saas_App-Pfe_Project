package com.example.Schedule_Service.filter;

import com.example.Schedule_Service.config.DataSourceConfig;
import com.example.Schedule_Service.context.TenantContext;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@AllArgsConstructor
@Component
public class TenantFilter implements Filter {

    private final DataSourceConfig dataSourceConfig;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        String tenantId = req.getHeader("X-Tenant-ID");
        log.info("Tenant ID: " + tenantId);
        if (tenantId != null && !tenantId.isEmpty()) {
            try {
                dataSourceConfig.addDataSourceIfMissing(tenantId);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            TenantContext.setCurrentTenant(tenantId);
        }

        try {
            chain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
}
