package com.example.Schedule_Service.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailableSlotDTO {
    private UUID timeBlockId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private int availableCapacity;
    private List<UUID> availableEmployeeIds;
    private List<UUID> availableServiceIds;
}
