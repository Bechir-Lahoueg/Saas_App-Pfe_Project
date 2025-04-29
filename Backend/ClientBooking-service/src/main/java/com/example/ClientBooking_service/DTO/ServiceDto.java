package com.example.ClientBooking_service.DTO;

import java.util.List;

public record ServiceDto(
        Long id,
        String name,
        Integer duration,
        Boolean requiresEmployeeSelection,
        Boolean allowSimultaneous,
        Integer capacity,
        List<EmployeeDto> employees
) {}