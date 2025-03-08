package com.example.auth_service.controller;

import com.example.auth_service.entities.Abonne;
import com.example.auth_service.service.AbonneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/abonne")
public class AbonneController {

    @Autowired
    private AbonneService abonneService;

    @PostMapping("/signup")
    public Abonne registerAbonne(@RequestBody Abonne abonne) {
        return abonneService.registerAbonne(abonne);
    }
}