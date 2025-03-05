package com.example.register_service.service;

import com.example.register_service.entities.Abonne;
import com.example.register_service.repository.AbonneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AbonneService {

    @Autowired
    private AbonneRepository abonneRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;  // To encrypt passwords

    public Abonne registerAbonne(Abonne abonne) {
        if (abonneRepository.findByEmail(abonne.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }

        abonne.setMotDePasse(passwordEncoder.encode(abonne.getMotDePasse()));

        return abonneRepository.save(abonne);
    }
}
