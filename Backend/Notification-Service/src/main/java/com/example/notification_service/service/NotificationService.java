package com.example.notification_service.service;

import com.example.notification_service.context.TenantContext;
import com.example.notification_service.events.ReservationCreatedEvent;
import com.example.notification_service.events.ReservationConfirmedEvent;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final TaskScheduler scheduler;

    // Trackers for scheduled reminders
    private final Map<Long, ScheduledFuture<?>> confirmReminderTasks = new ConcurrentHashMap<>();
    private final Map<Long, ScheduledFuture<?>> appointmentReminderTasks = new ConcurrentHashMap<>();

    @RabbitListener(queues = "reservation.created.notification.queue")
    public void onReservationCreated(ReservationCreatedEvent evt ) {
        log.info("Handling ReservationCreatedEvent: {}", evt);

        // 1) Initial email
        sendThymeleafEmail(
                evt.clientEmail(),
                "Nouvelle Réservation",
                "reservation-created",
                Map.of(
                        "reservationId", evt.reservationId(),
                        "startTime", evt.startTime().format(DATE_FORMATTER),
                        "confirmationCode", evt.confirmationCode()
                )
        );

        // 2) Schedule “5 min left” warning at now + 25 minutes
        Instant at = Instant.now().plusSeconds(25 * 60);
        ScheduledFuture<?> f = scheduler.schedule(
                () -> sendThymeleafEmail(
                        evt.clientEmail(),
                        "⚠️ Votre réservation va expirer",
                        "reservation-expire-warning",
                        Map.of(
                                "reservationId", evt.reservationId(),
                                "confirmationCode", evt.confirmationCode()
                        )
                ),
                at
        );
        confirmReminderTasks.put(evt.reservationId(), f);

        TenantContext.clear();
    }

    @RabbitListener(queues = "reservation.confirmed.notification.queue")
    public void onReservationConfirmed(ReservationConfirmedEvent evt) {
        log.info("Handling ReservationConfirmedEvent: {}", evt);

        // 1) Confirmation email
        sendThymeleafEmail(
                evt.clientEmail(),
                "Confirmation de Réservation",
                "reservation-confirmed",
                Map.of(
                        "reservationId", evt.reservationId(),
                        "startTime", evt.startTime().format(DATE_FORMATTER)
                )
        );

        // Cancel pending “5 min” reminder
        ScheduledFuture<?> pending = confirmReminderTasks.remove(evt.reservationId());
        if (pending != null) pending.cancel(false);

        // 2) Schedule “12 h before” reminder
        Instant at = evt.startTime()
                .minusHours(12)
                .atZone(ZoneId.systemDefault())
                .toInstant();
        ScheduledFuture<?> f2 = scheduler.schedule(
                () -> sendThymeleafEmail(
                        evt.clientEmail(),
                        "⏰ Rappel de votre réservation",
                        "upcoming-reservation-reminder",
                        Map.of(
                                "reservationId", evt.reservationId(),
                                "startTime", evt.startTime().format(DATE_FORMATTER)
                        )
                ),
                at
        );
        appointmentReminderTasks.put(evt.reservationId(), f2);

        TenantContext.clear();
    }

    /**
     * Renders the given template (by name) with Thymeleaf and sends it as HTML email.
     */
    private void sendThymeleafEmail(
            String to,
            String subject,
            String templateName,
            Map<String,Object> vars
    ) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Context ctx = new Context();
            vars.forEach(ctx::setVariable);

            String html = templateEngine.process(templateName, ctx);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);

            mailSender.send(message);
            log.info("Sent '{}' email to {}", subject, to);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new RuntimeException(e);
        }
    }
}