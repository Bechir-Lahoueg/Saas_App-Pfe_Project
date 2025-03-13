package com.example.auth_service.controller;

import com.example.auth_service.entities.Admin;
import com.example.auth_service.repository.AdminRepository;
import com.example.auth_service.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AdminController {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtUtil;

    public AdminController(AdminRepository adminRepository, JwtService jwtUtil) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.jwtUtil = jwtUtil;
    }

//    @PostMapping("/login")
//    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> request) {
//        System.out.println("Requête reçue pour /auth/login : " + request);
//        String email = request.get("email");
//        String password = request.get("password");
//
//        Admin admin = adminRepository.findByEmail(email)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email incorrect"));
//
//        if (!passwordEncoder.matches(password, admin.getPassword())) {
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Mot de passe incorrect");
//        }
//
//        String token = jwtUtil.generateToken( UserDetails);
//        System.out.println("Token généré : " + token);
//        return ResponseEntity.ok(Map.of("token", token));
//    }
}