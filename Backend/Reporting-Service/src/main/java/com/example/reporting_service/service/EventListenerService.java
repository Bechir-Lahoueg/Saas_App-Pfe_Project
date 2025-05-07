package com.example.reporting_service.service;


import com.example.reporting_service.entities.ReservationConfirmedEntity;
import com.example.reporting_service.entities.ReservationCreatedEntity;
import com.example.reporting_service.entities.TenantEventEntity;
import com.example.reporting_service.events.CategoryCreatedEvent;
import com.example.reporting_service.entities.CategoryEventEntity;
import com.example.reporting_service.events.ReservationConfirmedEvent;
import com.example.reporting_service.events.ReservationCreatedEvent;
import com.example.reporting_service.events.TenantCreatedEvent;
import com.example.reporting_service.repository.CategoryEventRepository;
import com.example.reporting_service.repository.ReservationConfirmedEventRepository;
import com.example.reporting_service.repository.ReservationCreatedEventRepository;
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
    private final ReservationCreatedEventRepository reservations;
    private final ReservationConfirmedEventRepository reservationConfirmed;

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

    @RabbitListener(queues = "reservation.created.queue")
    public void onReservationCreated(ReservationCreatedEvent e) {
        var res = new ReservationCreatedEntity();
        log.info("Received ReservationCreatedEvent: {}", e);
        res.setReservationId(e.reservationId());
        res.setClientEmail(e.clientEmail());
        res.setClientPhoneNumber(e.clientPhoneNumber());
        res.setConfirmationCode(e.confirmationCode());
        res.setStartTime(e.startTime());
        res.setStatus("PENDING");
        // Save the reservation event to the database
        log.info("Saving reservation event to the database: {}", res);
        reservations.save(res);
        // You can add logic to store reservation information in the database if needed
    }

    @RabbitListener(queues = "reservation.confirmed.queue")
    public void onReservationConfirmed(ReservationConfirmedEvent e) {
        var res = new ReservationConfirmedEntity();
        log.info("Received ReservationConfirmedEvent: {}", e);
        res.setReservationId(e.reservationId());
        res.setClientEmail(e.clientEmail());
        res.setClientPhoneNumber(e.clientPhoneNumber());
        res.setConfirmationCode(e.confirmationCode());
        res.setStartTime(e.startTime());
        res.setStatus("CONFIRMED");
        // Save the reservation event to the database
        log.info("Saving reservation event to the database: {}", res);
        reservationConfirmed.save(res);
    }
}
