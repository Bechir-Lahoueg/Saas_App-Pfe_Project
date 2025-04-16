//package com.example.Schedule_Service.service;
//
//import com.example.Schedule_Service.entities.WeeklySchedule;
//import com.example.Schedule_Service.repository.WeeklyScheduleRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//public class WeeklyScheduleService {
//    private final WeeklyScheduleRepository weeklyScheduleRepository;
//
//    public List<WeeklySchedule> getAllWeeklySchedules() {
//        return weeklyScheduleRepository.findAll();
//    }
//
//    public Optional<WeeklySchedule> getWeeklyScheduleById(UUID id) {
//        return weeklyScheduleRepository.findById(id);
//    }
//
//    public List<WeeklySchedule> getWeeklySchedulesByCalendarId(UUID calendarId) {
//        return weeklyScheduleRepository.findByCalendarId(calendarId);
//    }
//
//    public List<WeeklySchedule> getActiveWeeklySchedulesByCalendarId(UUID calendarId) {
//        return weeklyScheduleRepository.findByCalendarIdAndIsActiveTrue(calendarId);
//    }
//
//    @Transactional
//    public WeeklySchedule createWeeklySchedule(WeeklySchedule weeklySchedule) {
//        return weeklyScheduleRepository.save(weeklySchedule);
//    }
//
//    @Transactional
//    public WeeklySchedule updateWeeklySchedule(WeeklySchedule weeklySchedule) {
//        return weeklyScheduleRepository.save(weeklySchedule);
//    }
//
//    @Transactional
//    public void deleteWeeklySchedule(UUID id) {
//        weeklyScheduleRepository.deleteById(id);
//    }
//}