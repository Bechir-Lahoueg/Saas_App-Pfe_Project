package com.example.Schedule_Service.routing;

import com.example.Schedule_Service.config.DataSourceConfig;
import com.example.Schedule_Service.context.TenantContext;
import com.example.Schedule_Service.service.ReservationService;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

// USED FOR PENDING RESERVATIONS CLEANUP FOR ALL THE TENANTS (across all the databases)

@AllArgsConstructor
@Component
public class MultiTenantCleanupJob {

    private final DataSourceConfig dsConfig;
    private final ReservationService reservationService;


    @Scheduled(fixedRate = 600_000) // every 10 minute
    public void deleteAllTenantsPendingReservations() {
        for (String tenantId : dsConfig.getAllTenantIds()) {
            try {
                TenantContext.setCurrentTenant(tenantId);
                reservationService.deletePendingReservationsForCurrentTenant();
            } finally {
                TenantContext.clear();
            }
        }
    }
}