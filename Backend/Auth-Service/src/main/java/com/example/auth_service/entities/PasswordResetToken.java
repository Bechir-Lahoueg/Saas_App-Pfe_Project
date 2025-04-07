package com.example.auth_service.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_token", nullable = false)
    private UUID id;

    private String token;
    @OneToOne(targetEntity = Tenant.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "id_tenant" , referencedColumnName = "id_tenant")
    private Tenant tenant;

    private LocalDateTime expiryDate;

}