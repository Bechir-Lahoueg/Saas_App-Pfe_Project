package com.example.auth_service.entities;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "abonnes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Abonne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String motDePasse;
}