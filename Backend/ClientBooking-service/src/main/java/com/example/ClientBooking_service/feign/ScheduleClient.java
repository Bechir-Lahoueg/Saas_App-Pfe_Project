package com.example.ClientBooking_service.feign;

import com.example.ClientBooking_service.DTO.*;
import com.example.ClientBooking_service.config.ScheduleFeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(
        name = "schedule-service",
        path = "/schedule",
        configuration = ScheduleFeignConfig.class
)
public interface ScheduleClient {

    @GetMapping("/working-day/getall")
    List<WorkingDayDto> getWorkingDays(@RequestHeader("X-Tenant-ID") String tenantId);

    @GetMapping("/service/getall")
    List<ServiceDto> getServices(@RequestHeader("X-Tenant-ID") String tenantId);

    @GetMapping("/employee/getall")
    List<EmployeeDto> getEmployees(@RequestHeader("X-Tenant-ID") String tenantId);

    @GetMapping("/reservation/getall")
    List<ReservationDto> getReservations(@RequestHeader("X-Tenant-ID") String tenantId);

    @GetMapping("/media")
    List<MediaDto> getMedia(@RequestHeader("X-Tenant-ID") String tenantId);

    @PostMapping("/reservation/create")
    ReservationDto createReservation(
            @RequestHeader("X-Tenant-ID") String tenantId,
            @RequestBody CreateReservationRequest req
    );
}

