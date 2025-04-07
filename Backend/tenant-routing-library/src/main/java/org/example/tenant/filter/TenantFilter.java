package org.example.tenant.filter;

import org.example.tenant.context.TenantContext;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Servlet filter that extracts the tenant identifier from request headers
 * and stores it in the TenantContext for the duration of the request.
 */
@Component
@Order(1)
@Slf4j
public class TenantFilter implements Filter {

    private static final String TENANT_HEADER = "X-Tenant-ID";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        String tenantId = req.getHeader(TENANT_HEADER);

        if (tenantId != null) {
            log.debug("Setting tenant context: {}", tenantId);
            TenantContext.setCurrentTenant(tenantId);
        } else {
            log.warn("No tenant ID found in request headers");
        }

        try {
            chain.doFilter(request, response);
        } finally {
            TenantContext.clear();
            log.debug("Cleared tenant context");
        }
    }
}