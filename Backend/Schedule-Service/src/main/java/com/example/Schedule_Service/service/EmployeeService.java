package com.example.Schedule_Service.service;

import com.example.Schedule_Service.entities.Employee;
import com.example.Schedule_Service.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    // Méthodes existantes
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployee(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
    }

    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee updatedEmployee) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

        existingEmployee.setFirstName(updatedEmployee.getFirstName());
        existingEmployee.setLastName(updatedEmployee.getLastName());
        existingEmployee.setEmail(updatedEmployee.getEmail());
        existingEmployee.setPhone(updatedEmployee.getPhone());
        existingEmployee.setStatus(updatedEmployee.getStatus());

        return employeeRepository.save(existingEmployee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

        // Supprimer l'image associée si elle existe
        if (employee.getImageUrl() != null) {
            cloudinaryService.deleteEmployeeImage(id);
        }

        employeeRepository.deleteById(id);
    }

    // Nouvelle méthode pour gérer l'image de l'employé
    public Employee uploadEmployeeImage(Long id, MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le fichier est vide");
        }

        // Vérifier que l'employé existe
        if (!employeeRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found");
        }

        return cloudinaryService.uploadEmployeeImage(file, id);
    }

    // Méthode pour supprimer l'image d'un employé
    public Employee removeEmployeeImage(Long id) {
        // Vérifier que l'employé existe
        if (!employeeRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found");
        }

        return cloudinaryService.deleteEmployeeImage(id);
    }
}