package com.example.Schedule_Service.repository;

import com.example.Schedule_Service.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // Find an employee by email
    Employee findByEmail(String email);

    // Find all employees by status
    List<Employee> findByStatus(String status);
}
