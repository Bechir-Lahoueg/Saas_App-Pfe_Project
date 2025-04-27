package com.example.Schedule_Service.service;

import com.example.Schedule_Service.entities.Employee;
import com.example.Schedule_Service.entities.Services;
import com.example.Schedule_Service.repository.EmployeeRepository;
import com.example.Schedule_Service.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ServicesService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    // Get all services
    public List<Services> getAllServices() {
        return serviceRepository.findAll();
    }

    // Get a service by ID
    public Services getService(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
    }

    // Create a new service
    public Services createService(Services service) {
        return serviceRepository.save(service);
    }

    // Update an existing service
    public Services updateService(Long id, Services updatedService) {
        Services existingService = serviceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        existingService.setName(updatedService.getName());
        existingService.setDescription(updatedService.getDescription());
        existingService.setDuration(updatedService.getDuration());
        existingService.setPrice(updatedService.getPrice());
        existingService.setRequiresEmployeeSelection(updatedService.isRequiresEmployeeSelection());
        existingService.setAllowSimultaneous(updatedService.isAllowSimultaneous());
        existingService.setCapacity(updatedService.getCapacity());
        existingService.getEmployees().clear();
        if (updatedService.getEmployeeIds() != null) {
            for (Long empId : updatedService.getEmployeeIds()) {
                Employee e = employeeRepository.findById(empId)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "Employee not found"));
                existingService.getEmployees().add(e);
            }
        }
        return serviceRepository.save(existingService);
    }

    // Delete a service
    public void deleteService(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found");
        }
        serviceRepository.deleteById(id);
    }
}
