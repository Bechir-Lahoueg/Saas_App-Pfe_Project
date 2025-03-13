package com.example.auth_service.service;

import com.example.auth_service.entities.LoginResponse;
import com.example.auth_service.entities.Subscriber;
import com.example.auth_service.repository.SubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class SubscriberService {

    @Autowired
    private SubscriberRepository SubscriberRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;  // To encrypt passwords

    @Autowired
    private  JwtService jwtService;

    public List<Subscriber> getAllSubscribers() {
        return SubscriberRepository.findAll();
    }

    public Subscriber getSubscriberById(Long id) {
        return SubscriberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Abonne not found with id: " + id));
    }

    public Subscriber updateSubscriber(Long id, Subscriber abonneDetails) {
        Subscriber abonne = getSubscriberById(id);

        abonne.setFirstName(abonneDetails.getFirstName());
        abonne.setLastName(abonneDetails.getLastName());
        abonne.setEmail(abonneDetails.getEmail());
        abonne.setPhone(abonneDetails.getPhone());

        // Only update password if it's provided and different
        if (abonneDetails.getPassword() != null && !abonneDetails.getPassword().isEmpty()) {
            abonne.setPassword(passwordEncoder.encode(abonneDetails.getPassword()));
        }

        return SubscriberRepository.save(abonne);
    }

    public void deleteSubscriber(Long id) {
        Subscriber Subscriber = getSubscriberById(id);
        SubscriberRepository.delete(Subscriber);

    }

    public LoginResponse login(String email, String motDePasse) {
        Subscriber subscriber = SubscriberRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(motDePasse, subscriber.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return LoginResponse.builder()
                .accessToken(jwtService.generateToken(subscriber))
                .subscriber(subscriber)
                .build();
    }

}