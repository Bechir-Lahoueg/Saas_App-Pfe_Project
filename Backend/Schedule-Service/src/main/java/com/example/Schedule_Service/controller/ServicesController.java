package com.example.Schedule_Service.controller;

import com.example.Schedule_Service.entities.Employee;
import com.example.Schedule_Service.entities.Services;
import com.example.Schedule_Service.repository.EmployeeRepository;
import com.example.Schedule_Service.service.ServicesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/service")
public class ServicesController {

    @Autowired
    private ServicesService serviceService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping("/getall")
    public List<Services> getAllServices() {
        return serviceService.getAllServices();
    }

    @GetMapping("/get/{id}")
    public Services getService(@PathVariable Long id) {
        return serviceService.getService(id);
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public Services createService(@RequestBody Services service) {
        if (service.getEmployeeIds() != null) {
            Set<Employee> employees = new HashSet<>(employeeRepository.findAllById(service.getEmployeeIds()));
            service.setEmployees(employees);
        }
        return serviceService.createService(service);
    }

    @PutMapping("/update/{id}")
    public Services updateService(@PathVariable Long id, @RequestBody Services service) {
        if (service.getEmployeeIds() != null) {
            Set<Employee> employees = new HashSet<>(employeeRepository.findAllById(service.getEmployeeIds()));
            service.setEmployees(employees);
        }
        return serviceService.updateService(id, service);
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
    }
}
