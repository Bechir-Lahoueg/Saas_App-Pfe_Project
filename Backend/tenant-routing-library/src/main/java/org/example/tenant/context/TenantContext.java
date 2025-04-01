package org.example.tenant.context;

import lombok.extern.slf4j.Slf4j;

/**
 * Stores the current tenant identifier in a ThreadLocal variable,
 * making it accessible throughout the request processing lifecycle.
 */
@Slf4j
public class TenantContext {
    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();

    /**
     * Sets the current tenant identifier
     *
     * @param tenantId The tenant identifier to set
     */
    public static void setCurrentTenant(String tenantId) {
        log.debug("Setting tenant context to: {}", tenantId);
        CURRENT_TENANT.set(tenantId);
    }

    /**
     * Gets the current tenant identifier
     *
     * @return The current tenant identifier or null if not set
     */
    public static String getCurrentTenant() {
        return CURRENT_TENANT.get();
    }

    /**
     * Clears the current tenant identifier
     * This should be called at the end of request processing
     */
    public static void clear() {
        CURRENT_TENANT.remove();
    }
}