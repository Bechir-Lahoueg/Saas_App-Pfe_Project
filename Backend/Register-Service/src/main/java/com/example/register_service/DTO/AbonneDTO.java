package com.example.register_service.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AbonneDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String motDePasse;
    // Add any other necessary fields
}