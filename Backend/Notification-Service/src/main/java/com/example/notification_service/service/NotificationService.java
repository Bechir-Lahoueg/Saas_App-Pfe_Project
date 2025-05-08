package com.example.notification_service.service;

import com.example.notification_service.events.ReservationCreatedEvent;
import com.example.notification_service.events.ReservationConfirmedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

@Slf4j
@RequiredArgsConstructor
@Service
public class NotificationService {

    private final JavaMailSender mailSender;
    private final TaskScheduler scheduler;

    /** Tracks the “5 min‑left to confirm” reminders **/
    private final Map<Long, ScheduledFuture<?>> confirmReminderTasks = new ConcurrentHashMap<>();

    /** Tracks the “12 h‑before appointment” reminders **/
    private final Map<Long, ScheduledFuture<?>> appointmentReminderTasks = new ConcurrentHashMap<>();

    @RabbitListener(queues = "reservation.created.notification.queue")
    public void onCreated(ReservationCreatedEvent evt) {
        // 1) Send initial confirmation email
        log.info("Received ReservationCreatedEvent: {}", evt);

        sendEmail(evt.clientEmail(),
                "Please confirm your reservation",
                "Your confirmation code is: " + evt.confirmationCode());

        // 2) Schedule “5 minutes left to confirm” reminder at T+25m
        Instant confirmReminderAt = Instant.now().plus(25, ChronoUnit.MINUTES);
        ScheduledFuture<?> confirmFuture = scheduler.schedule(
                () -> sendEmail(evt.clientEmail(),
                        "⚠️ Your reservation is about to expire",
                        "You have 5 minutes left to confirm your reservation before it is auto‑cancelled."),
                confirmReminderAt
        );
        confirmReminderTasks.put(evt.reservationId(), confirmFuture);

        // 3) Schedule “12 hours before start” reminder
        Instant appointmentReminderAt = evt.startTime()
                .minusHours(12)
                .atZone(ZoneId.systemDefault())
                .toInstant();
        ScheduledFuture<?> apptFuture = scheduler.schedule(
                () -> sendEmail(evt.clientEmail(),
                        "⏰ Upcoming reservation reminder",
                        "Just a friendly reminder: your reservation is scheduled at "
                                + evt.startTime() + "."),
                appointmentReminderAt
        );
        appointmentReminderTasks.put(evt.reservationId(), apptFuture);
    }

    @RabbitListener(queues = "reservation.confirmed.notification.queue")
    public void onConfirmed(ReservationConfirmedEvent evt) {
        // Cancel the “5 min‑left” confirm reminder
        log.info("removing the 5 min expiration reminder for reservationId: {}", evt.reservationId());
        ScheduledFuture<?> f1 = confirmReminderTasks.remove(evt.reservationId());
        if (f1 != null) f1.cancel(false);

    }

    private void sendEmail(String to, String subject, String body) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(body);
        mailSender.send(msg);
    }
}
