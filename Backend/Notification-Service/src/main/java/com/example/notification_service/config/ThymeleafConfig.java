package com.example.notification_service.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.ResourceLoader;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.FileTemplateResolver;
import org.thymeleaf.templateresolver.StringTemplateResolver;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

@Slf4j
@Configuration
public class ThymeleafConfig {

    private final ResourceLoader resourceLoader;

    public ThymeleafConfig(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    // Renommé de templateEngine à emailTemplateEngine
    @Bean
    public TemplateEngine emailTemplateEngine() {
        // Vérification des templates
        try {
            ClassPathResource resource = new ClassPathResource("templates/email/reservation-created.html");
            log.info("Template reservation-created.html existe: {}", resource.exists());
            log.info("Chemin absolu: {}", resource.getFile().getAbsolutePath());
        } catch (IOException e) {
            log.error("Erreur lors de la vérification du template", e);
        }

        SpringTemplateEngine templateEngine = new SpringTemplateEngine();

        // Configuration des resolvers
        FileTemplateResolver fileResolver = new FileTemplateResolver();
        fileResolver.setPrefix("src/main/resources/templates/email/");
        fileResolver.setSuffix(".html");
        fileResolver.setTemplateMode(TemplateMode.HTML);
        fileResolver.setCharacterEncoding("UTF-8");
        fileResolver.setCacheable(false);
        fileResolver.setOrder(1);
        fileResolver.setCheckExistence(true);

        templateEngine.addTemplateResolver(fileResolver);

        StringTemplateResolver stringResolver = new StringTemplateResolver();
        stringResolver.setOrder(2);
        templateEngine.addTemplateResolver(stringResolver);

        return templateEngine;
    }

    // Les autres méthodes restent inchangées
    @Bean
    public String reservationCreatedTemplate() {
        try {
            ClassPathResource resource = new ClassPathResource("templates/email/reservation-created.html");
            return new String(Files.readAllBytes(resource.getFile().toPath()), StandardCharsets.UTF_8);
        } catch (IOException e) {
            log.error("Impossible de charger le template reservation-created.html", e);
            return "<p>Erreur: Template non trouvé</p>";
        }
    }

    @Bean
    public String reservationConfirmedTemplate() {
        try {
            ClassPathResource resource = new ClassPathResource("templates/email/reservation-confirmed.html");
            return new String(Files.readAllBytes(resource.getFile().toPath()), StandardCharsets.UTF_8);
        } catch (IOException e) {
            log.error("Impossible de charger le template reservation-confirmed.html", e);
            return "<p>Erreur: Template non trouvé</p>";
        }
    }
    @Bean
    public String upcomingReservationReminderTemplate() {
        try {
            ClassPathResource resource = new ClassPathResource("templates/email/upcoming-reservation-reminder.html");
            return new String(Files.readAllBytes(resource.getFile().toPath()), StandardCharsets.UTF_8);
        } catch (IOException e) {
            log.error("Impossible de charger le template upcoming-reservation-reminder.html", e);
            return "<p>Erreur: Template non trouvé</p>";
        }
    }

    @Bean
    public String reservationExpireWarningTemplate() {
        try {
            ClassPathResource resource = new ClassPathResource("templates/email/reservation-expire-warning.html");
            return new String(Files.readAllBytes(resource.getFile().toPath()), StandardCharsets.UTF_8);
        } catch (IOException e) {
            log.error("Impossible de charger le template reservation-expire-warning.html", e);
            return "<p>Erreur: Template non trouvé</p>";
        }
    }
}