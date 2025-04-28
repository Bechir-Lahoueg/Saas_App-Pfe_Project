package com.example.Schedule_Service.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.Schedule_Service.entities.Media;
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

    private static final int MAX_PHOTOS = 5;

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
    public CloudinaryService(Cloudinary cloudinary, MediaRepository mediaRepository) {
        this.cloudinary = cloudinary;
        this.mediaRepository = mediaRepository;
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

    private void validateMediaTypeAndLimits(String mediaType) {
        if (MediaType.LOGO.getValue().equals(mediaType)) {
            if (countMediaByType(MediaType.LOGO.getValue()) >= 1) {
                throw new IllegalStateException("Un seul logo est autorisé. Veuillez supprimer l'existant avant d'en ajouter un nouveau.");
            }
        } else if (MediaType.BANNER.getValue().equals(mediaType)) {
            if (countMediaByType(MediaType.BANNER.getValue()) >= 1) {
                throw new IllegalStateException("Une seule bannière est autorisée. Veuillez supprimer l'existante avant d'en ajouter une nouvelle.");
            }
        } else if (MediaType.VIDEO.getValue().equals(mediaType)) {
            if (countMediaByType(MediaType.VIDEO.getValue()) >= 1) {
                throw new IllegalStateException("Une seule vidéo est autorisée. Veuillez supprimer l'existante avant d'en ajouter une nouvelle.");
            }
        } else if (MediaType.PHOTO.getValue().equals(mediaType)) {
            if (countMediaByType(MediaType.PHOTO.getValue()) >= MAX_PHOTOS) {
                throw new IllegalStateException("Maximum " + MAX_PHOTOS + " photos autorisées. Veuillez supprimer une photo existante avant d'en ajouter une nouvelle.");
            }
        } else {
            throw new IllegalArgumentException("Type de média non supporté: " + mediaType + ". Types valides: logo, banner, video, photo");
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
                .orElseThrow(() -> new RuntimeException("Média non trouvé"));

        try {
            cloudinary.uploader().destroy(
                    media.getPublicId(),
                    ObjectUtils.asMap("resource_type", media.getResourceType())
            );
            mediaRepository.delete(media);
        } catch (IOException e) {
            throw new RuntimeException("Échec de suppression du média", e);
        }
    }
}