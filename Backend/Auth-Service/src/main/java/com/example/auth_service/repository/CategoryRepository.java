package com.example.auth_service.repository;

import com.example.auth_service.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByCategoryName(String categoryName);

    @Query("""
      SELECT c.id        AS id,
             c.categoryName AS name,
             COUNT(t)      AS tenantCount
        FROM Tenant t
        JOIN t.category c
    GROUP BY c.id, c.categoryName
    ORDER BY COUNT(t) DESC
    """)
    List<Object[]> findTopCategoriesByTenantCountRaw();
}

