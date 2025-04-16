package com.example.Schedule_Service.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.util.UUID;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private Integer price;

    private Integer durationInMinutes = 60; // How long a reservation lasts

    private Integer maxConcurrentReservations = 1; // 1 = exclusive, >1 = shared (like half court)

    private Boolean allowPartialReservation = false; // for playgrounds, etc.
}
