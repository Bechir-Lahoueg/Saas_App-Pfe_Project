package com.example.reporting_service.repository;

import com.example.reporting_service.entities.CategoryEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryEventRepository
        extends JpaRepository<CategoryEventEntity,Long>
{
    @Query("SELECT COUNT(DISTINCT c.categoryId) FROM CategoryEventEntity c")
    long countDistinctCategories();

    @Query("""
    SELECT c.categoryId, c.categoryName, COUNT(t)
      FROM TenantEventEntity t
      JOIN CategoryEventEntity c
        ON t.categoryId = c.categoryId
     GROUP BY c.categoryId, c.categoryName
     ORDER BY COUNT(t) DESC
  """)
    List<Object[]> findTopCategoriesByTenantCount();
}