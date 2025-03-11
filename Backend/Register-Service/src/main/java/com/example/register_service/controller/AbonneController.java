package com.example.register_service.controller;

import com.example.register_service.service.AbonneService;
import com.example.register_service.entities.Abonne;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/register")
public class AbonneController {

    @Autowired
    private AbonneService abonneService;

    @PostMapping("/signup")
    public ResponseEntity<Abonne> registerAbonne(@RequestBody Abonne abonne) {
        return new ResponseEntity<>(abonneService.registerAbonne(abonne), HttpStatus.OK);
    }
}