package com.example.reporting_service.service;


import com.example.reporting_service.entities.TenantEventEntity;
import com.example.reporting_service.events.CategoryCreatedEvent;
import com.example.reporting_service.entities.CategoryEventEntity;
import com.example.reporting_service.events.TenantCreatedEvent;
import com.example.reporting_service.repository.CategoryEventRepository;
import com.example.reporting_service.repository.TenantEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class EventListenerService {
    private final CategoryEventRepository categories;
    private final TenantEventRepository tenants;

    @RabbitListener(queues = "category.created.queue")
    public void onCategoryCreated(CategoryCreatedEvent e) {
        var ent = new CategoryEventEntity();
        log.info("Received CategoryCreatedEvent: {}", e);
        ent.setCategoryId(e.categoryId());
        ent.setCategoryName(e.categoryName());
        ent.setTimestamp(e.timestamp());
        categories.save(ent);
    }

    @RabbitListener(queues = "tenant.created.queue")
    public void onTenantCreated(TenantCreatedEvent e) {
        var ten = new TenantEventEntity();

        log.info("Received TenantCreatedEvent: {}", e);
        ten.setTenantId(e.Id());
        ten.setCategoryId(e.categoryId());
        ten.setTimestamp(e.timestamp());
        tenants.save(ten);

        // You can add logic to store tenant information in the database if needed
    }
}
