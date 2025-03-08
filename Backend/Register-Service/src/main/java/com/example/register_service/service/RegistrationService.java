package com.example.register_service.service;

import com.example.register_service.DTO.AbonneDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class RegistrationService {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private RestTemplate restTemplate;

    public AbonneDTO registerAbonne(AbonneDTO abonne) {
        // Encrypt password
        abonne.setMotDePasse(passwordEncoder.encode(abonne.getMotDePasse()));

        // Save the Abonne in auth-service database via API call
        AbonneDTO registeredAbonne = restTemplate.postForObject(
                "http://localhost:8888/auth/abonne/signup",
                abonne,
                AbonneDTO.class);

        return registeredAbonne;
    }
}