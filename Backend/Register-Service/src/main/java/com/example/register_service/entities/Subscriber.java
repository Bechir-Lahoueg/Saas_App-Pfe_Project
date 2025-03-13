package com.example.register_service.entities;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subscribers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Subscriber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password;
}