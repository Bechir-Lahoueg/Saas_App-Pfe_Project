package com.example.Schedule_Service.controller;

import com.example.Schedule_Service.entities.Employee;
import com.example.Schedule_Service.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/employee")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    // Méthodes existantes
    @GetMapping("/getall")
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/get/{id}")
    public Employee getEmployee(@PathVariable Long id) {
        return employeeService.getEmployee(id);
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public Employee createEmployee(@RequestBody Employee employee) {
        return employeeService.createEmployee(employee);
    }

    @PutMapping("/update/{id}")
    public Employee updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
        return employeeService.updateEmployee(id, employee);
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
    }

    // Nouvelle méthode pour l'upload d'image d'employé
    @PostMapping(value = "/upload-image/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Employee uploadEmployeeImage(@PathVariable Long id, @RequestParam("image") MultipartFile image) {
        return employeeService.uploadEmployeeImage(id, image);
    }

    // Méthode pour supprimer l'image d'un employé
    @DeleteMapping("/remove-image/{id}")
    public Employee removeEmployeeImage(@PathVariable Long id) {
        return employeeService.removeEmployeeImage(id);
    }
}