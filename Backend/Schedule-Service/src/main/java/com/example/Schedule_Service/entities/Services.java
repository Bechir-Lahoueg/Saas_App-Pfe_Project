package com.example.Schedule_Service.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.*;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Services {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private Integer duration;

    private Integer price;

    private boolean requiresEmployeeSelection;

    private boolean allowSimultaneous;

    private Integer capacity;

    @ManyToMany
    @JoinTable(
            name = "service_employees",
            joinColumns = @JoinColumn(name = "service_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    private Set<Employee> employees = new HashSet<>();

    @Transient
    @JsonProperty("employeeIds")
    private List<Long> employeeIds = new ArrayList<>();
}
