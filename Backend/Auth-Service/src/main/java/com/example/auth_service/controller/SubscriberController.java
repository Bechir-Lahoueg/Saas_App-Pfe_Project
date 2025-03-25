package com.example.auth_service.controller;

import com.example.auth_service.entities.LoginRequestSubscriber;
import com.example.auth_service.entities.LoginResponseSubscriber;
import com.example.auth_service.entities.Subscriber;
import com.example.auth_service.service.SubscriberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/subscriber")
public class SubscriberController {

    @Autowired
    private SubscriberService SubscriberService;


    @GetMapping("/getall")
    public ResponseEntity<List<Subscriber>> getAllSubscribers() {
        return new ResponseEntity<>(SubscriberService.getAllSubscribers(), HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Subscriber> getSubscriberById(@PathVariable Long id) {
        return new ResponseEntity<>(SubscriberService.getSubscriberById(id), HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Subscriber> updateSubscriber(@PathVariable Long id, @RequestBody Subscriber Subscriber) {
        return new ResponseEntity<>(SubscriberService.updateSubscriber(id, Subscriber), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSubscriber(@PathVariable Long id) {
        SubscriberService.deleteSubscriber(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseSubscriber> login(@RequestBody LoginRequestSubscriber request) {
        return  ResponseEntity.ok(SubscriberService.login(request.getEmail(), request.getPassword()));
    }


}