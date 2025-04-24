package com.example.auth_service.service;

import com.example.auth_service.entities.Category;
import com.example.auth_service.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class CategoryService {

    @Autowired
    private final CategoryRepository categoryRepository;
    // Create
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Read
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Optional<Category> getCategoryByName(String categoryName) {
        return categoryRepository.findByCategoryName(categoryName);
    }

    // Update
    public Category updateCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Delete
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
