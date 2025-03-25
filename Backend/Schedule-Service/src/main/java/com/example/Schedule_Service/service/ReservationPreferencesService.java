package com.example.Schedule_Service.service;

import com.example.Schedule_Service.entities.ReservationPreferences;
import com.example.Schedule_Service.repository.ReservationPreferencesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationPreferencesService {
    private final ReservationPreferencesRepository preferencesRepository;

    public List<ReservationPreferences> getAllReservationPreferences() {
        return preferencesRepository.findAll();
    }

    public Optional<ReservationPreferences> getReservationPreferencesById(UUID id) {
        return preferencesRepository.findById(id);
    }

    public Optional<ReservationPreferences> getReservationPreferencesBySubscriberId(Long subscriberId) {
        return preferencesRepository.findBySubscriberId(subscriberId);
    }

    @Transactional
    public ReservationPreferences createReservationPreferences(ReservationPreferences preferences) {
        return preferencesRepository.save(preferences);
    }

    @Transactional
    public ReservationPreferences updateReservationPreferences(ReservationPreferences preferences) {
        return preferencesRepository.save(preferences);
    }

    @Transactional
    public void deleteReservationPreferences(UUID id) {
        preferencesRepository.deleteById(id);
    }
}