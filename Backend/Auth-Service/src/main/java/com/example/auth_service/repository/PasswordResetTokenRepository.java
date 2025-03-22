package com.example.auth_service.repository;

import com.example.auth_service.entities.PasswordResetToken;
import com.example.auth_service.entities.Subscriber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteBySubscriber(Subscriber subscriber);

}