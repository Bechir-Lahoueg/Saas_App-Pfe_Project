package com.example.Schedule_Service.service;

import com.example.Schedule_Service.entities.Calendar;
import com.example.Schedule_Service.repository.CalendarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CalendarService {
    private final CalendarRepository calendarRepository;

    public List<Calendar> getAllCalendars() {
        return calendarRepository.findAll();
    }

    public Optional<Calendar> getCalendarById(UUID id) {
        return calendarRepository.findById(id);
    }

    public List<Calendar> getCalendarsBySubscriberId(Long subscriberId) {
        return calendarRepository.findBySubscriberId(subscriberId);
    }

    @Transactional
    public Calendar createCalendar(Calendar calendar) {
        return calendarRepository.save(calendar);
    }

    @Transactional
    public Calendar updateCalendar(Calendar calendar) {
        return calendarRepository.save(calendar);

    }

    @Transactional
    public void deleteCalendar(UUID id) {
        calendarRepository.deleteById(id);
    }
}