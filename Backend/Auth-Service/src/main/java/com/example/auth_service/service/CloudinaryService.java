package com.example.auth_service.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) {
        try {
            // Générer un nom unique pour l'image
            String filename = UUID.randomUUID().toString();

            // Upload l'image dans le dossier "categories" sur Cloudinary
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", "categories/" + filename,
                            "overwrite", true,
                            "resource_type", "auto"
                    )
            );

            // Récupérer et retourner l'URL sécurisée
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            log.error("Erreur lors de l'upload de l'image: {}", e.getMessage(), e);
            throw new RuntimeException("Échec du téléchargement de l'image: " + e.getMessage(), e);
        }
    }

    public void deleteImage(String imageUrl) {
        try {
            // Extraire le public_id depuis l'URL
            if (imageUrl != null && imageUrl.contains("/categories/")) {
                String publicId = "categories/" + imageUrl.substring(imageUrl.lastIndexOf("/") + 1,
                        imageUrl.lastIndexOf("."));
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (IOException e) {
            log.error("Erreur lors de la suppression de l'image: {}", e.getMessage(), e);
        }
    }

    public String uploadTenantProfileImage(MultipartFile file) {
        try {
            // Générer un nom unique pour l'image
            String filename = UUID.randomUUID().toString();

            // Upload l'image dans le dossier "tenantPdp" sur Cloudinary
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", "tenantPdp/" + filename,
                            "overwrite", true,
                            "resource_type", "auto",  // Added to properly handle different file types
                            "timeout", 60000  // Increased timeout for larger files
                    )
            );

            // Récupérer et retourner l'URL sécurisée
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            log.error("Erreur lors de l'upload de la photo de profil: {}", e.getMessage(), e);
            throw new RuntimeException("Échec du téléchargement de la photo de profil: " + e.getMessage(), e);
        }
    }

    public void deleteTenantProfileImage(String imageUrl) {
        try {
            // Extraire le public_id depuis l'URL
            if (imageUrl != null && imageUrl.contains("/tenantPdp/")) {
                String publicId = "tenantPdp/" + imageUrl.substring(imageUrl.lastIndexOf("/") + 1,
                        imageUrl.lastIndexOf("."));
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (IOException e) {
            log.error("Erreur lors de la suppression de la photo de profil: {}", e.getMessage(), e);
        }
    }
}