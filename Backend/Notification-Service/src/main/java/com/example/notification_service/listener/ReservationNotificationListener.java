package com.example.notification_service.listener;

import com.example.notification_service.context.TenantContext;
import com.example.notification_service.events.ReservationCreatedEvent;
import com.example.notification_service.events.ReservationConfirmedEvent;
import com.example.notification_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReservationNotificationListener {

    private final EmailService emailService;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    @RabbitListener(queues = "reservation.created.notification.queue")
    public void handleReservationCreated(ReservationCreatedEvent event, @Header("X-Tenant-ID") String tenantId) {
        log.info("Reçu événement de réservation créée: {}", event);
        TenantContext.setCurrentTenant(tenantId);

        try {
            Map<String, Object> variables = new HashMap<>();
            variables.put("reservationId", event.reservationId());
            variables.put("startTime", event.startTime().format(DATE_FORMATTER));
            variables.put("confirmationCode", event.confirmationCode());

            emailService.sendTemplateEmail(
                    event.clientEmail(),
                    "Votre demande de réservation",
                    "reservation-created",
                    variables
            );
        } finally {
            TenantContext.clear();
        }
    }

    @RabbitListener(queues = "reservation.confirmed.notification.queue")
    public void handleReservationConfirmed(ReservationConfirmedEvent event, @Header("X-Tenant-ID") String tenantId) {
        log.info("Reçu événement de réservation confirmée: {}", event);
        TenantContext.setCurrentTenant(tenantId);

        try {
            Map<String, Object> variables = new HashMap<>();
            variables.put("reservationId", event.reservationId());
            variables.put("startTime", event.startTime().format(DATE_FORMATTER));
            variables.put("confirmationCode", event.confirmationCode());

            emailService.sendTemplateEmail(
                    event.clientEmail(),
                    "Confirmation de votre réservation",
                    "reservation-confirmed",
                    variables
            );
        } finally {
            TenantContext.clear();
        }
    }
}