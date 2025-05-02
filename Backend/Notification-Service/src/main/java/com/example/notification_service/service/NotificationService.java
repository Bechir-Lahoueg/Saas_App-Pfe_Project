package com.example.notification_service.service;

import com.example.notification_service.events.ReservationCreatedEvent;
import com.example.notification_service.events.ReservationConfirmedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@RequiredArgsConstructor
@Service
public class NotificationService {

    private final JavaMailSender mailSender;
    private final TaskScheduler scheduler;
    private final Map<Long, ScheduledFuture<?>> expireTasks = new ConcurrentHashMap<>();

    @RabbitListener(queues = "reservation.created.queue")
    public void onCreated(ReservationCreatedEvent evt) {
        // 1) send confirmation email
        var msg = new SimpleMailMessage();
        msg.setTo(evt.clientEmail());
        msg.setSubject("Please confirm your reservation");
        msg.setText("Your confirmation code is: " + evt.confirmationCode());
        mailSender.send(msg);

        // 2) schedule an in-memory “reminder to confirm” if you like (not strictly needed)
        var reminderAt = Instant.now().plus(25, ChronoUnit.MINUTES);
        var future = scheduler.schedule(
                () -> sendReminder(evt.clientEmail()),
                reminderAt
        );
        expireTasks.put(evt.reservationId(), future);

        // 3) schedule SMS reminder 12h before the actual startTime
        var smsAt = evt.startTime()
                .minusHours(12)
                .atZone(ZoneId.systemDefault())
                .toInstant();
        scheduler.schedule(
                () -> sendSms(evt.clientPhoneNumber(), "Reminder: your appointment is in 12 hours"),
                smsAt
        );
    }

    @RabbitListener(queues = "reservation.confirmed.queue")
    public void onConfirmed(ReservationConfirmedEvent evt) {
        // cancel the “confirm reminder”
        var f = expireTasks.remove(evt.reservationId());
        if (f != null) f.cancel(false);
    }

    private void sendReminder(String to) {
        var msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Reservation still unconfirmed");
        msg.setText("You have 5 minutes left to confirm your reservation before it is auto-cancelled.");
        mailSender.send(msg);
    }

    private void sendSms(String phone, String text) {
        // TODO integrate your SMS provider
    }
}
