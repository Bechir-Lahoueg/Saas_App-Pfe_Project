package com.example.ClientBooking_service.DTO;

import java.util.List;

public record AvailabilityDto(
        List<WorkingDayDto> workingDays,
        List<ServiceDto>       services,
        List<EmployeeDto>      employees,
        List<ReservationDto>   reservations,
        List<MediaDto>         medias
) {}