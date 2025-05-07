package com.example.reporting_service.controller;

import com.example.reporting_service.dto.ReservationSummaryDto;
import com.example.reporting_service.service.TenantReportingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tenant")
public class TenantReportsController {

    private final TenantReportingService reportingService;


    @GetMapping("/reservations/summary")
    public ResponseEntity<ReservationSummaryDto> reservationSummary() {
        ReservationSummaryDto summary = reportingService.getReservationSummary();
        return ResponseEntity.ok(summary);
    }
}
