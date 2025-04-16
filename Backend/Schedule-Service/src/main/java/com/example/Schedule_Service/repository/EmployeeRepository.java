//package com.example.Schedule_Service.repository;
//
//import com.example.Schedule_Service.entities.Employee;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//import java.util.UUID;
//
//@Repository
//public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
//    List<Employee> findByCalendarId(UUID calendarId);
//    List<Employee> findByCalendarIdAndIsAvailableTrue(UUID calendarId);
//}