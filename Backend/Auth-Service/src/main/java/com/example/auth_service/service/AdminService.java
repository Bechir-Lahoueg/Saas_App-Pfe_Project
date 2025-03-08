package com.example.auth_service.service;

import com.example.auth_service.entities.Admin;
import com.example.auth_service.repository.AdminRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

@Service
public class AdminService {
    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @PostConstruct
    public void initAdmin() {
        if (adminRepository.findByEmail("bechirsafwene@gmail.com").isEmpty()) {
            Admin admin = new Admin();
            admin.setEmail("bechirsafwene@gmail.com");
            admin.setPassword(passwordEncoder.encode("azerty123"));
            adminRepository.save(admin);
            System.out.println("Admin par défaut créé !");
        }
    }
}