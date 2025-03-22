package com.example.auth_service.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_token", nullable = false)
    private Long id;

    private String token;
    @OneToOne(targetEntity = Subscriber.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "id_subscriber" , referencedColumnName = "id_subscriber")
    private Subscriber subscriber;

    private LocalDateTime expiryDate;

}