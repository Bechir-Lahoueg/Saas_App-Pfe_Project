package com.example.auth_service.service;

import com.example.auth_service.entities.Category;
import com.example.auth_service.events.CategoryCreatedEvent;
import com.example.auth_service.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Slf4j
@AllArgsConstructor
@Service
public class CategoryService {

    @Autowired
    RabbitTemplate rabbit;
    @Autowired
    DirectExchange categoryExchange;

    @Autowired
    private final CategoryRepository categoryRepository;
    // Create
    public Category createCategory(Category category) {
        Category c= categoryRepository.save(category);
        var evt = new CategoryCreatedEvent(c.getId(), c.getCategoryName(), Instant.now());
        log.info("Received CategoryCreatedEvent: {}", evt);
        rabbit.convertAndSend(categoryExchange.getName(), "category.created", evt);
        return c;
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
