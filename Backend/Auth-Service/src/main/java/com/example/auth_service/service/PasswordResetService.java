package com.example.auth_service.service;

import com.example.auth_service.entities.PasswordResetToken;
import com.example.auth_service.entities.Subscriber;
import com.example.auth_service.repository.PasswordResetTokenRepository;
import com.example.auth_service.repository.SubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private SubscriberRepository SubscriberRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.reset-password.url}")
    private String resetPasswordUrl;

    public void generateResetToken(String email) {
        Optional<Subscriber> SubscriberOpt = SubscriberRepository.findByEmail(email);

        if (SubscriberOpt.isPresent()) {
            Subscriber Subscriber = SubscriberOpt.get();

            // Delete any existing tokens
            tokenRepository.deleteBySubscriber(Subscriber);

            // Generate new token
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setSubscriber(Subscriber);
            resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
            tokenRepository.save(resetToken);

            // Send email
            sendResetEmail(Subscriber.getEmail(), token);
        }
        // We don't notify if the email doesn't exist for security reasons
    }

    private void sendResetEmail(String email, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset Request");
        message.setText("To reset your password, click the link below:\n\n"
                + resetPasswordUrl + "?token=" + token
                + "\n\nThis link will expire in 1 hour.");

        mailSender.send(message);
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);

        if (tokenOpt.isPresent()) {
            PasswordResetToken resetToken = tokenOpt.get();

            // Check if token is expired
            if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                tokenRepository.delete(resetToken);
                return false;
            }

            // Update password
            Subscriber Subscriber = resetToken.getSubscriber();
            Subscriber.setPassword(passwordEncoder.encode(newPassword));
            SubscriberRepository.save(Subscriber);

            // Delete used token
            tokenRepository.delete(resetToken);

            return true;
        }

        return false;
    }
}
