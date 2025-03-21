package com.example.auth_service.service;

import com.example.auth_service.entities.LoginResponseSubscriber;
import com.example.auth_service.entities.Subscriber;
import com.example.auth_service.repository.SubscriberRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;

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

    public LoginResponseSubscriber login(String email, String password) {
        Subscriber subscriber = SubscriberRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, subscriber.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return LoginResponseSubscriber.builder()
                .accessToken(jwtService.generateToken(subscriber))
                .refreshToken(jwtService.generateRefreshToken(subscriber))
                .subscriber(subscriber)
                .build();
    }





}