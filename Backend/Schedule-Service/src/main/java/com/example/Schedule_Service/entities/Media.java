package com.example.Schedule_Service.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "media")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "media_type", nullable = false)
    private String mediaType; // logo, banner, video, photo

    @Column(name = "public_id", nullable = false)
    private String publicId; // nécessaire pour la suppression dans Cloudinary

    @Column(name = "resource_type")
    private String resourceType; // image ou video

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private java.util.Date createdAt;
}