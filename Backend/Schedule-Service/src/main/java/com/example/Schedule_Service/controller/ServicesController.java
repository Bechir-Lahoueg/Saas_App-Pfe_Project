package com.example.Schedule_Service.controller;

import com.example.Schedule_Service.entities.Employee;
import com.example.Schedule_Service.entities.Services;
import com.example.Schedule_Service.repository.EmployeeRepository;
import com.example.Schedule_Service.service.ServicesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping("/service")
public class ServicesController {

    @Autowired private ServicesService serviceService;
    @Autowired private EmployeeRepository employeeRepository;

    @GetMapping("/getall")
    public List<Services> getAll() {
        return serviceService.getAllServices();
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public Services create(@RequestBody Services service) {
        // Map employeeIds → actual Employee entities
        if (service.getEmployeeIds() != null) {
            Set<Employee> emps = new HashSet<>(
                    employeeRepository.findAllById(service.getEmployeeIds())
            );
            service.setEmployees(emps);
        }
        return serviceService.createService(service);
    }

    @PutMapping("/update/{id}")
    public Services update(@PathVariable Long id, @RequestBody Services service) {
        // Same mapping logic
        if (service.getEmployeeIds() != null) {
            Set<Employee> emps = new HashSet<>(
                    employeeRepository.findAllById(service.getEmployeeIds())
            );
            service.setEmployees(emps);
        }
        return serviceService.updateService(id, service);
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        serviceService.deleteService(id);
    }
}
