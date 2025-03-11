package com.example.auth_service.service;

import com.example.auth_service.entities.Abonne;
import com.example.auth_service.repository.AbonneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AbonneService {

    @Autowired
    private AbonneRepository abonneRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;  // To encrypt passwords


    public List<Abonne> getAllAbonnes() {
        return abonneRepository.findAll();
    }

    public Abonne getAbonneById(Long id) {
        return abonneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Abonne not found with id: " + id));
    }

    public Abonne updateAbonne(Long id, Abonne abonneDetails) {
        Abonne abonne = getAbonneById(id);

        abonne.setNom(abonneDetails.getNom());
        abonne.setPrenom(abonneDetails.getPrenom());
        abonne.setEmail(abonneDetails.getEmail());
        abonne.setTelephone(abonneDetails.getTelephone());

        // Only update password if it's provided and different
        if (abonneDetails.getMotDePasse() != null && !abonneDetails.getMotDePasse().isEmpty()) {
            abonne.setMotDePasse(passwordEncoder.encode(abonneDetails.getMotDePasse()));
        }

        return abonneRepository.save(abonne);
    }

    public void deleteAbonne(Long id) {
        Abonne abonne = getAbonneById(id);
        abonneRepository.delete(abonne);

    }

    public Abonne login(String email, String motDePasse) {
        Abonne abonne = abonneRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(motDePasse, abonne.getMotDePasse())) {
            throw new RuntimeException("Invalid password");
        }

        return abonne;
    }

}