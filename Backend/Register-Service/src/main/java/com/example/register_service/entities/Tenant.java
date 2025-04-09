package com.example.register_service.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
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

    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private String zipcode;
    private String country;
    private String city;

    // Business information
    private String businessName;
    private String subdomain; // For custom URL (businessname.yoursaas.com)
    private String address;

    // Database connection info for each service
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "tenant")
    private List<TenantDatabase> databases;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return email;
    }

}