package com.example.reporting_service.service;

import com.example.reporting_service.dto.CategoryRankingDto;
import com.example.reporting_service.repository.CategoryEventRepository;
import com.example.reporting_service.repository.TenantEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class AdminReportingService {

    @Autowired
    private final TenantEventRepository tenRepo;
    private final CategoryEventRepository   catRepo;

    public long totalCategories() {
        return catRepo.countDistinctCategories();
    }

    public long totalTenants() {
        return tenRepo.count();   // assumes one TenantCreatedEvent per tenant
    }

    public List<CategoryRankingDto> categoryRanking() {
        var rows = catRepo.findTopCategoriesByTenantCount();
        var out = new ArrayList<CategoryRankingDto>();
        for (var r : rows) {
            out.add(new CategoryRankingDto(
                    (Long) r[0],      // categoryId
                    (String) r[1],    // categoryName
                    ((Number) r[2]).longValue()
            ));
        }
        return out;
    }


}
