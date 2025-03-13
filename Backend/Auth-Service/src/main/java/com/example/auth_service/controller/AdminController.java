package com.example.auth_service.controller;

import com.example.auth_service.entities.Admin;
import com.example.auth_service.entities.LoginRequest;
import com.example.auth_service.entities.LoginResponse;
import com.example.auth_service.service.AdminService;
import com.example.auth_service.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/auth/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;
    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Admin admin = adminService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!adminService.checkPassword(request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return ResponseEntity.ok(
                LoginResponse.builder()
                        .accessToken(jwtService.generateToken(admin))
                        .build()
        );
    }
}
