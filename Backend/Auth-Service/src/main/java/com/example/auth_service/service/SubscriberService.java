//package com.example.auth_service.service;
//
//import com.example.auth_service.entities.LoginResponseSubscriber;
//import com.example.auth_service.entities.Subscriber;
//import com.example.auth_service.repository.PasswordResetTokenRepository;
//import com.example.auth_service.repository.SubscriberRepository;
//import jakarta.transaction.Transactional;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.stereotype.Service;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import java.util.List;
//
//@Service
//public class SubscriberService {
//
//    private static final Logger logger = LoggerFactory.getLogger(SubscriberService.class);
//
//    @Autowired
//    private SubscriberRepository subscriberRepository;
//
//    @Autowired
//    private BCryptPasswordEncoder passwordEncoder;  // To encrypt passwords
//
//    @Autowired
//    private PasswordResetTokenRepository passwordResetTokenRepository;
//
//    @Autowired
//    private JwtService jwtService;
//
//    public List<Subscriber> getAllSubscribers() {
//        return subscriberRepository.findAll();
//    }
//
//    public Subscriber getSubscriberById(Long id) {
//        logger.debug("Fetching subscriber with id: {}", id);
//        return subscriberRepository.findById(id)
//                .orElseThrow(() -> {
//                    logger.error("Subscriber not found with id: {}", id);
//                    return new RuntimeException("Subscriber not found with id: " + id);
//                });
//    }
//
//    public Subscriber updateSubscriber(Long id, Subscriber subscriberDetails) {
//        Subscriber subscriber = getSubscriberById(id);
//
//        subscriber.setFirstName(subscriberDetails.getFirstName());
//        subscriber.setLastName(subscriberDetails.getLastName());
//        subscriber.setEmail(subscriberDetails.getEmail());
//        subscriber.setPhone(subscriberDetails.getPhone());
//
//        // Only update password if it's provided and different
//        if (subscriberDetails.getPassword() != null && !subscriberDetails.getPassword().isEmpty()) {
//            subscriber.setPassword(passwordEncoder.encode(subscriberDetails.getPassword()));
//        }
//
//        return subscriberRepository.save(subscriber);
//    }
//
//    @Transactional
//    public void deleteSubscriber(Long id) {
//        logger.debug("Fetching subscriber with id: {}", id);
//        Subscriber subscriber = getSubscriberById(id);
//
//        logger.debug("Deleting password reset tokens for subscriber with id: {}", id);
//        passwordResetTokenRepository.deleteByTenant(subscriber);
//
//        logger.debug("Deleting subscriber with id: {}", id);
//        subscriberRepository.delete(subscriber);
//    }
//
//    public LoginResponseSubscriber login(String email, String password) {
//        Subscriber subscriber = subscriberRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
//
//        if (!passwordEncoder.matches(password, subscriber.getPassword())) {
//            throw new RuntimeException("Invalid password");
//        }
//
//        return LoginResponseSubscriber.builder()
//                .accessToken(jwtService.generateToken(subscriber))
//                .refreshToken(jwtService.generateRefreshToken(subscriber))
//                .subscriber(subscriber)
//                .build();
//    }
//}