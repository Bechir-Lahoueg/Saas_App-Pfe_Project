package com.example.Schedule_Service.service;

import com.example.Schedule_Service.entities.ServiceEntity;
import com.example.Schedule_Service.entities.Employee;
import com.example.Schedule_Service.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceEntityService {
    private final ServiceRepository serviceRepository;

    public List<ServiceEntity> getAllServices() {
        return serviceRepository.findAll();
    }

    public Optional<ServiceEntity> getServiceById(UUID id) {
        return serviceRepository.findById(id);
    }

    public List<ServiceEntity> getServicesByCalendarId(UUID calendarId) {
        return serviceRepository.findByCalendarId(calendarId);
    }

    @Transactional
    public ServiceEntity createService(ServiceEntity service) {
        return serviceRepository.save(service);
    }

    @Transactional
    public ServiceEntity updateService(ServiceEntity service) {
        return serviceRepository.save(service);
    }

    @Transactional
    public ServiceEntity addEmployeeToService(UUID serviceId, Employee employee) {
        ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        service.getAvailableEmployees().add(employee);
        return serviceRepository.save(service);
    }

    @Transactional
    public ServiceEntity removeEmployeeFromService(UUID serviceId, UUID employeeId) {
        ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        service.getAvailableEmployees().removeIf(employee -> employee.getId().equals(employeeId));
        return serviceRepository.save(service);
    }

    @Transactional
    public void deleteService(UUID id) {
        serviceRepository.deleteById(id);
    }
}