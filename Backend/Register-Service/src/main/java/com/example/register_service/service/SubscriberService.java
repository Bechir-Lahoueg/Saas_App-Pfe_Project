package com.example.register_service.service;

import com.example.register_service.entities.Subscriber;
import com.example.register_service.repository.SubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SubscriberService {
    @Autowired
    private SubscriberRepository SubscriberRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public Subscriber registerSubscriber(Subscriber Subscriber) {
        if (SubscriberRepository.findByEmail(Subscriber.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }

        Subscriber.setPassword(passwordEncoder.encode(Subscriber.getPassword()));
        return SubscriberRepository.save(Subscriber);
    }
}
