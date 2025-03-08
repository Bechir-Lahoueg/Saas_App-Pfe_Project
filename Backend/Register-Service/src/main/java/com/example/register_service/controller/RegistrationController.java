package com.example.register_service.controller;

import com.example.register_service.DTO.AbonneDTO;
import com.example.register_service.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/abonne")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @PostMapping("/signup")
    public ResponseEntity<AbonneDTO> registerAbonne(@RequestBody AbonneDTO abonne) {
        return new ResponseEntity<>(registrationService.registerAbonne(abonne), HttpStatus.CREATED);
    }
}