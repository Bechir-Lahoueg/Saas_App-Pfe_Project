package com.example.Schedule_Service.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.Schedule_Service.entities.Employee;
import com.example.Schedule_Service.entities.Media;
import com.example.Schedule_Service.repository.EmployeeRepository;
import com.example.Schedule_Service.repository.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;
    private final MediaRepository mediaRepository;
    private final EmployeeRepository employeeRepository;

    private static final int MAX_PHOTOS = 5;
    private static final String EMPLOYEE_FOLDER = "employees";

    public enum MediaType {
        LOGO("logo"),
        BANNER("banner"),
        VIDEO("video"),
        PHOTO("photo");

        private final String value;

        MediaType(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    @Autowired
    public CloudinaryService(Cloudinary cloudinary, MediaRepository mediaRepository, EmployeeRepository employeeRepository) {
        this.cloudinary = cloudinary;
        this.mediaRepository = mediaRepository;
        this.employeeRepository = employeeRepository;
    }

    public Media uploadFile(MultipartFile file, String mediaType) {
        try {
            // Validation du type de média et des limites
            validateMediaTypeAndLimits(mediaType);

            // Détermine si c'est une image ou une vidéo
            String resourceType = "image";
            if (file.getContentType() != null && file.getContentType().startsWith("video/")) {
                resourceType = "video";
                if (!mediaType.equals(MediaType.VIDEO.getValue())) {
                    throw new IllegalArgumentException("Le fichier est une vidéo mais le type de média n'est pas 'video'");
                }
            }

            // Organisation des fichiers par type
            String folder = mediaType;

            // Upload vers Cloudinary
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", resourceType,
                            "folder", folder
                    )
            );

            // Enregistrement des métadonnées
            Media media = new Media();
            media.setPublicId((String) uploadResult.get("public_id"));
            media.setUrl((String) uploadResult.get("url"));
            media.setResourceType(resourceType);
            media.setMediaType(mediaType);
            media.setCreatedAt(new java.util.Date());

            return mediaRepository.save(media);
        } catch (IOException e) {
            throw new RuntimeException("Échec de l'upload vers Cloudinary", e);
        }
    }

    // Méthode modifiée pour les images d'employés (sans utiliser imagePublicId)
    public Employee uploadEmployeeImage(MultipartFile file, Long employeeId) {
        try {
            Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new RuntimeException("Employé non trouvé avec l'ID: " + employeeId));

            // Upload de la nouvelle image
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "image",
                            "folder", EMPLOYEE_FOLDER
                    )
            );

            // Mise à jour uniquement de l'URL de l'image
            employee.setImageUrl((String) uploadResult.get("url"));

            return employeeRepository.save(employee);
        } catch (IOException e) {
            throw new RuntimeException("Échec de l'upload de l'image de l'employé", e);
        }
    }

    private void validateMediaTypeAndLimits(String mediaType) {
        boolean isValidType = false;
        for (MediaType type : MediaType.values()) {
            if (type.getValue().equals(mediaType)) {
                isValidType = true;
                break;
            }
        }

        if (!isValidType) {
            throw new IllegalArgumentException("Type de média non valide: " + mediaType);
        }

        // Vérification des limites pour les photos
        if (mediaType.equals(MediaType.PHOTO.getValue()) && countMediaByType(mediaType) >= MAX_PHOTOS) {
            throw new IllegalStateException("Limite maximum de " + MAX_PHOTOS + " photos atteinte");
        }
    }

    private int countMediaByType(String mediaType) {
        return mediaRepository.findByMediaType(mediaType).size();
    }

    public List<Media> getAllMedia() {
        return mediaRepository.findAll();
    }

    public List<Media> getMediaByType(String mediaType) {
        return mediaRepository.findByMediaType(mediaType);
    }

    public void deleteMedia(Long id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media non trouvé avec ID: " + id));

        try {
            // Supprime le fichier de Cloudinary
            cloudinary.uploader().destroy(
                    media.getPublicId(),
                    ObjectUtils.asMap("resource_type", media.getResourceType())
            );

            // Supprime l'entrée de la base de données
            mediaRepository.deleteById(id);
        } catch (IOException e) {
            throw new RuntimeException("Échec de la suppression du média", e);
        }
    }

    // Méthode modifiée pour supprimer l'image d'un employé (sans imagePublicId)
    public Employee deleteEmployeeImage(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé avec l'ID: " + employeeId));

        // Simplement supprimer la référence à l'image
        employee.setImageUrl(null);
        return employeeRepository.save(employee);
    }
}