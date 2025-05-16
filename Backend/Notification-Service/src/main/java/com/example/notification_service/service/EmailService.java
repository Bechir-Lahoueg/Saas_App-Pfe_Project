package com.example.notification_service.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Slf4j
@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final String reservationCreatedTemplate;
    private final String reservationConfirmedTemplate;
    private final String upcomingReservationReminderTemplate;
    private final String reservationExpireWarningTemplate;

    public EmailService(
            JavaMailSender mailSender,
            @Qualifier("emailTemplateEngine") TemplateEngine templateEngine,
            @Qualifier("reservationCreatedTemplate") String reservationCreatedTemplate,
            @Qualifier("reservationConfirmedTemplate") String reservationConfirmedTemplate,
            @Qualifier("upcomingReservationReminderTemplate") String upcomingReservationReminderTemplate,
            @Qualifier("reservationExpireWarningTemplate") String reservationExpireWarningTemplate
    ) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.reservationCreatedTemplate = reservationCreatedTemplate;
        this.reservationConfirmedTemplate = reservationConfirmedTemplate;
        this.upcomingReservationReminderTemplate = upcomingReservationReminderTemplate;
        this.reservationExpireWarningTemplate = reservationExpireWarningTemplate;
    }

    public void sendTemplateEmail(String to, String subject, String templateName, Map<String, Object> variables) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            Context context = new Context();
            variables.forEach(context::setVariable);

            String htmlContent;
            if ("reservation-created".equals(templateName)) {
                htmlContent = templateEngine.process(reservationCreatedTemplate, context);
            } else if ("reservation-confirmed".equals(templateName)) {
                htmlContent = templateEngine.process(reservationConfirmedTemplate, context);
            } else if ("upcoming-reservation-reminder".equals(templateName)) {
                htmlContent = templateEngine.process(upcomingReservationReminderTemplate, context);
            } else if ("reservation-expire-warning".equals(templateName)) {
                htmlContent = templateEngine.process(reservationExpireWarningTemplate, context);
            } else {
                htmlContent = "<p>Template non trouvé: " + templateName + "</p>";
            }

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            log.info("Email envoyé avec succès à {}", to);
        } catch (MessagingException e) {
            log.error("Erreur lors de l'envoi de l'email à {}: {}", to, e.getMessage());
            throw new RuntimeException("Erreur lors de l'envoi de l'email", e);
        }
    }
}