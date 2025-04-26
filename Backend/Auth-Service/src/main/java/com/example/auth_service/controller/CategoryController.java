package com.example.auth_service.controller;

import com.example.auth_service.entities.Category;
import com.example.auth_service.service.CategoryService;
import com.example.auth_service.service.CloudinaryService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/category")
@AllArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    private final CloudinaryService cloudinaryService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Category> createCategory(
            @RequestPart("category") Category category,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(image);
            category.setImageUrl(imageUrl);
        }

        Category createdCategory = categoryService.createCategory(category);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @RequestPart("category") Category category,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        Optional<Category> existingCategory = categoryService.getCategoryById(id);
        if (existingCategory.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Category categoryToUpdate = existingCategory.get();

        // Si une nouvelle image est fournie, supprimer l'ancienne et télécharger la nouvelle
        if (image != null && !image.isEmpty()) {
            if (categoryToUpdate.getImageUrl() != null) {
                cloudinaryService.deleteImage(categoryToUpdate.getImageUrl());
            }
            String imageUrl = cloudinaryService.uploadImage(image);
            category.setImageUrl(imageUrl);
        } else {
            // Conserver l'URL de l'image existante si aucune nouvelle image n'est fournie
            category.setImageUrl(categoryToUpdate.getImageUrl());
        }

        category.setId(id);
        Category updatedCategory = categoryService.updateCategory(category);
        return ResponseEntity.ok(updatedCategory);
    }

    @GetMapping("/getall")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Optional<Category> category = categoryService.getCategoryById(id);
        return category
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/getCatgoryByName/{categoryName}")
    public ResponseEntity<Category> getCategoryByName(@PathVariable String categoryName) {
        Optional<Category> category = categoryService.getCategoryByName(categoryName);
        return category
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        Optional<Category> existingCategory = categoryService.getCategoryById(id);
        if (existingCategory.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Supprimer l'image de Cloudinary si elle existe
        if (existingCategory.get().getImageUrl() != null) {
            cloudinaryService.deleteImage(existingCategory.get().getImageUrl());
        }

        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}