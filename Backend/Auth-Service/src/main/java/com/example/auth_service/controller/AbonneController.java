package com.example.auth_service.controller;

import com.example.auth_service.entities.Abonne;
import com.example.auth_service.service.AbonneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.auth_service.feign.RegisterServiceClient;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/abonne")
public class AbonneController {

    @Autowired
    private AbonneService abonneService;

    @Autowired
    private RegisterServiceClient registerServiceClient;



    @PostMapping("/signup")
    public ResponseEntity<Abonne> registerAbonne(@RequestBody Abonne abonne) {
        return registerServiceClient.registerAbonne(abonne);
    }

    @GetMapping("/getall")
    public ResponseEntity<List<Abonne>> getAllAbonnes() {
        return new ResponseEntity<>(abonneService.getAllAbonnes(), HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Abonne> getAbonneById(@PathVariable Long id) {
        return new ResponseEntity<>(abonneService.getAbonneById(id), HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Abonne> updateAbonne(@PathVariable Long id, @RequestBody Abonne abonne) {
        return new ResponseEntity<>(abonneService.updateAbonne(id, abonne), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteAbonne(@PathVariable Long id) {
        abonneService.deleteAbonne(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}