package com.example.Schedule_Service.controller;

import com.example.Schedule_Service.entities.Employee;
import com.example.Schedule_Service.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable UUID id) {
        return employeeService.getEmployeeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/calendar/{calendarId}")
    public ResponseEntity<List<Employee>> getEmployeesByCalendarId(@PathVariable UUID calendarId) {
        return ResponseEntity.ok(employeeService.getEmployeesByCalendarId(calendarId));
    }

    @GetMapping("/calendar/{calendarId}/available")
    public ResponseEntity<List<Employee>> getAvailableEmployees(@PathVariable UUID calendarId) {
        return ResponseEntity.ok(employeeService.getAvailableEmployees(calendarId));
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        return new ResponseEntity<>(employeeService.createEmployee(employee), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable UUID id, @RequestBody Employee employee) {
        if (!id.equals(employee.getId())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(employeeService.updateEmployee(employee));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable UUID id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}