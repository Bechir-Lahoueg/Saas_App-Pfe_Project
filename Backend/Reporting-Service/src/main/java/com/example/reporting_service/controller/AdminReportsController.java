package com.example.reporting_service.controller;


import com.example.reporting_service.dto.CategoryRankingDto;
import com.example.reporting_service.service.ReportingService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/adminReports")
public class AdminReportsController {

    @Autowired
    private final ReportingService svc;


    @GetMapping("/total-categories")
    public long totalCategories() {
        return svc.totalCategories();
    }

    @GetMapping("/total-tenants")
    public long totalTenants() {
        return svc.totalTenants();
    }

    @GetMapping("/categories/ranking")
    public List<CategoryRankingDto> categoryRanking() {
        return svc.categoryRanking();
    }
}
