//package com.example.Schedule_Service.controller;
//
//import com.example.Schedule_Service.entities.ServiceEntity;
//import com.example.Schedule_Service.entities.Employee;
//import com.example.Schedule_Service.service.ServiceEntityService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/service")
//@RequiredArgsConstructor
//public class ServiceController {
//    private final ServiceEntityService serviceEntityService;
//
//    @GetMapping
//    public ResponseEntity<List<ServiceEntity>> getAllServices() {
//        return ResponseEntity.ok(serviceEntityService.getAllServices());
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<ServiceEntity> getServiceById(@PathVariable UUID id) {
//        return serviceEntityService.getServiceById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    @GetMapping("/calendar/{calendarId}")
//    public ResponseEntity<List<ServiceEntity>> getServicesByCalendarId(@PathVariable UUID calendarId) {
//        return ResponseEntity.ok(serviceEntityService.getServicesByCalendarId(calendarId));
//    }
//
//    @PostMapping
//    public ResponseEntity<ServiceEntity> createService(@RequestBody ServiceEntity service) {
//        return new ResponseEntity<>(serviceEntityService.createService(service), HttpStatus.CREATED);
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<ServiceEntity> updateService(@PathVariable UUID id, @RequestBody ServiceEntity service) {
//        if (!id.equals(service.getId())) {
//            return ResponseEntity.badRequest().build();
//        }
//        return ResponseEntity.ok(serviceEntityService.updateService(service));
//    }
//
//    @PostMapping("/{serviceId}/employees")
//    public ResponseEntity<ServiceEntity> addEmployeeToService(
//            @PathVariable UUID serviceId,
//            @RequestBody Employee employee) {
//        return ResponseEntity.ok(serviceEntityService.addEmployeeToService(serviceId, employee));
//    }
//
//    @DeleteMapping("/{serviceId}/employees/{employeeId}")
//    public ResponseEntity<ServiceEntity> removeEmployeeFromService(
//            @PathVariable UUID serviceId,
//            @PathVariable UUID employeeId) {
//        return ResponseEntity.ok(serviceEntityService.removeEmployeeFromService(serviceId, employeeId));
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteService(@PathVariable UUID id) {
//        serviceEntityService.deleteService(id);
//        return ResponseEntity.noContent().build();
//    }
//}