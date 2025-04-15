package com.example.notification_service.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;


@Data
@Builder
@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    private String title;
    private String message;
    private Date sendingDate;
    private boolean read;

}
