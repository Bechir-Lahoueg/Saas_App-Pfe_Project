package com.example.Schedule_Service.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRequestDTO {
    private UUID calendarId;
    private UUID timeBlockId;
    private UUID serviceId;
    private UUID employeeId; // Optional
    private LocalDate date;
    private LocalTime startTime;
    private String clientName;
    private String clientEmail;
    private String clientPhone;
    private Integer numberOfParticipants;
}