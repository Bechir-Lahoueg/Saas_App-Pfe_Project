//package com.example.Schedule_Service.service;
//
//import com.example.Schedule_Service.entities.Employee;
//import com.example.Schedule_Service.repository.EmployeeRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//public class EmployeeService {
//    private final EmployeeRepository employeeRepository;
//
//    public List<Employee> getAllEmployees() {
//        return employeeRepository.findAll();
//    }
//
//    public Optional<Employee> getEmployeeById(UUID id) {
//        return employeeRepository.findById(id);
//    }
//
//    public List<Employee> getEmployeesByCalendarId(UUID calendarId) {
//        return employeeRepository.findByCalendarId(calendarId);
//    }
//
//    public List<Employee> getAvailableEmployees(UUID calendarId) {
//        return employeeRepository.findByCalendarIdAndIsAvailableTrue(calendarId);
//    }
//
//    @Transactional
//    public Employee createEmployee(Employee employee) {
//        return employeeRepository.save(employee);
//    }
//
//    @Transactional
//    public Employee updateEmployee(Employee employee) {
//        return employeeRepository.save(employee);
//    }
//
//    @Transactional
//    public void deleteEmployee(UUID id) {
//        employeeRepository.deleteById(id);
//    }
//}