//package com.example.auth_service.repository;
//
//import com.example.auth_service.entities.Subscriber;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.Optional;
//
//@Repository
//public interface SubscriberRepository extends JpaRepository<Subscriber, Long> {
//    Optional<Subscriber> findByEmail(String email);  // Check if email already exists
//}