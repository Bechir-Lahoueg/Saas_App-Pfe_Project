package com.example.register_service.controller;

import com.example.register_service.entities.Abonne;
import com.example.register_service.service.AbonneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/register")
public class AbonneController {

    @Autowired
    private AbonneService abonneService;

    @PostMapping("/abonne")
    public Abonne registerAbonne(@RequestBody Abonne abonne) {
        return abonneService.registerAbonne(abonne);
    }
}