// Remove @Component from TenantContextFilter.java
package com.example.notification_service.filter;

import com.example.notification_service.tenant.TenantContext;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

// Remove @Component annotation here
public class TenantContextFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String tenantId = httpRequest.getHeader("X-Tenant-ID");

        if (tenantId != null) {
            TenantContext.setTenantId(tenantId);
        }

        try {
            chain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
}