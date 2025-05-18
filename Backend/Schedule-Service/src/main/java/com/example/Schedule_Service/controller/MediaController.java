package com.example.Schedule_Service.controller;

import com.example.Schedule_Service.entities.Media;
import com.example.Schedule_Service.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/media")
public class MediaController {

    private final CloudinaryService cloudinaryService;

    @Autowired
    public MediaController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Media> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam("mediaType") String mediaType) {
        Media uploadedMedia = cloudinaryService.uploadFile(file, mediaType);
        return new ResponseEntity<>(uploadedMedia, HttpStatus.CREATED);
    }

    @GetMapping("/getall")
    public ResponseEntity<List<Media>> getAllMedia() {
        List<Media> mediaList = cloudinaryService.getAllMedia();
        return ResponseEntity.ok(mediaList);
    }

    @GetMapping("/type/{mediaType}")
    public ResponseEntity<List<Media>> getMediaByType(@PathVariable String mediaType) {
        List<Media> mediaList = cloudinaryService.getMediaByType(mediaType);
        return ResponseEntity.ok(mediaList);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteMedia(@PathVariable Long id) {
        cloudinaryService.deleteMedia(id);
        return ResponseEntity.noContent().build();
    }
}