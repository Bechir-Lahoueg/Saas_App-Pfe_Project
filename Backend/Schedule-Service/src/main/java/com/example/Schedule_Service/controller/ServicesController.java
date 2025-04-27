package com.example.Schedule_Service.controller;

import com.example.Schedule_Service.entities.Services;
import com.example.Schedule_Service.service.ServicesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/service")
public class ServicesController {
    @Autowired
    private ServicesService serviceService;

    // Get all services
    @GetMapping("/getall")
    public List<Services> getAllServices() {
        return serviceService.getAllServices();
    }

    // Get a service by ID
    @GetMapping("/get/{id}")
    public Services getService(@PathVariable Long id) {
        return serviceService.getService(id);
    }

    // Create a new service
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public Services createService(@RequestBody Services service) {
        return serviceService.createService(service);
    }

    // Update an existing service
    @PutMapping("/get/{id}")
    public Services updateService(@PathVariable Long id, @RequestBody Services service) {
        return serviceService.updateService(id, service);
    }

    // Delete a service
    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
    }
}
