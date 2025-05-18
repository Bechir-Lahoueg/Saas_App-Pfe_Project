package com.example.register_service.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tenants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tenant implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_tenant", nullable = false)

    private UUID id;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String password;
    private String country;
    private String city;
    private String address;
    private String zipcode;

    private String subdomain;
    private String businessName;

    @Enumerated(EnumType.STRING)
    private Role role = Role.TENANT;


    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return email;
    }

    public enum Role {
        ADMIN,
        TENANT
    }

    public static class TenantBuilder {
        private Role role = Role.TENANT; // Default value in builder
    }


}