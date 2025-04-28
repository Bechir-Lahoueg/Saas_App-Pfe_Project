package com.example.Schedule_Service.repository;

import com.example.Schedule_Service.entities.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findByMediaType(String mediaType);
}