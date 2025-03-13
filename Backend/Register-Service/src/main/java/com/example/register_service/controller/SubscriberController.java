package com.example.register_service.controller;

import com.example.register_service.service.SubscriberService;
import com.example.register_service.entities.Subscriber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/register")
public class SubscriberController {

    @Autowired
    private SubscriberService SubscriberService;

    @PostMapping("/signup")
    public ResponseEntity<Subscriber> registerSubscriber(@RequestBody Subscriber Subscriber) {
        return new ResponseEntity<>(SubscriberService.registerSubscriber(Subscriber), HttpStatus.OK);
    }
}