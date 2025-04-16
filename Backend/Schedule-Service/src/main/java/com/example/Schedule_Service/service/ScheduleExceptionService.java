//package com.example.Schedule_Service.service;
//
//import com.example.Schedule_Service.entities.ScheduleException;
//import com.example.Schedule_Service.repository.ScheduleExceptionRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDate;
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//public class ScheduleExceptionService {
//    private final ScheduleExceptionRepository scheduleExceptionRepository;
//
//    public List<ScheduleException> getAllScheduleExceptions() {
//        return scheduleExceptionRepository.findAll();
//    }
//
//    public Optional<ScheduleException> getScheduleExceptionById(UUID id) {
//        return scheduleExceptionRepository.findById(id);
//    }
//
//    public List<ScheduleException> getScheduleExceptionsByCalendarId(UUID calendarId) {
//        return scheduleExceptionRepository.findByCalendarId(calendarId);
//    }
//
//    public Optional<ScheduleException> getScheduleExceptionByCalendarIdAndDate(UUID calendarId, LocalDate date) {
//        return scheduleExceptionRepository.findByCalendarIdAndExceptionDate(calendarId, date);
//    }
//
//    public List<ScheduleException> getScheduleExceptionsByCalendarIdAndDateRange(UUID calendarId, LocalDate startDate, LocalDate endDate) {
//        return scheduleExceptionRepository.findByCalendarIdAndExceptionDateBetween(calendarId, startDate, endDate);
//    }
//
//    @Transactional
//    public ScheduleException createScheduleException(ScheduleException scheduleException) {
//        return scheduleExceptionRepository.save(scheduleException);
//    }
//
//    @Transactional
//    public ScheduleException updateScheduleException(ScheduleException scheduleException) {
//        return scheduleExceptionRepository.save(scheduleException);
//    }
//
//    @Transactional
//    public void deleteScheduleException(UUID id) {
//        scheduleExceptionRepository.deleteById(id);
//    }
//}