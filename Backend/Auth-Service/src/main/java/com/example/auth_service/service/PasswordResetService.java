package com.example.auth_service.service;

import com.example.auth_service.entities.PasswordResetToken;
import com.example.auth_service.entities.Tenant;
import com.example.auth_service.repository.PasswordResetTokenRepository;
import com.example.auth_service.repository.TenantRepository;
import jakarta.transaction.Transactional;
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
    private TenantRepository tenantRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.reset-password.url}")
    private String resetPasswordUrl;

    @Transactional
    public void generateResetToken(String email) {
        Optional<Tenant> TenantOpt = tenantRepository.findByEmail(email);

        if (TenantOpt.isPresent()) {
            Tenant Tenant = TenantOpt.get();

            // Delete any existing tokens
            tokenRepository.deleteByTenant(Tenant);

            // Generate new token
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setTenant(Tenant);
            resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
            tokenRepository.save(resetToken);

            // Send email
            sendResetEmail(Tenant.getEmail(), token);
        }else {
            throw new IllegalArgumentException("tenant with email " + email + " does not exist");
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

    @Transactional
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
            Tenant Tenant = resetToken.getTenant();
            Tenant.setPassword(passwordEncoder.encode(newPassword));
            tenantRepository.save(Tenant);

            // Delete used token
            tokenRepository.delete(resetToken);

            return true;
        }

        return false;
    }
}
