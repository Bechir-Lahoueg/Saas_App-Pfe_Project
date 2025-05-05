package com.example.reporting_service.repository;


import com.example.reporting_service.entities.TenantEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TenantEventRepository extends JpaRepository<TenantEventEntity,Long> {

}
