package com.example.reporting_service.service;

import com.example.reporting_service.dto.ReservationSummaryDto;
import com.example.reporting_service.repository.ReservationConfirmedEventRepository;
import com.example.reporting_service.repository.ReservationCreatedEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class TenantReportingService {

    private final ReservationCreatedEventRepository createdRepo;
    private final ReservationConfirmedEventRepository confirmedRepo;


    public ReservationSummaryDto getReservationSummary() {
        long total     = createdRepo.count();
        long confirmed = confirmedRepo.count();
        long pending   = total - confirmed;
        return new ReservationSummaryDto(total, confirmed, pending );
    }
}

