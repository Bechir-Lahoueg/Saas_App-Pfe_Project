//package com.example.Schedule_Service.service;
//
//import com.example.Schedule_Service.entities.DailySchedule;
//import com.example.Schedule_Service.repository.DailyScheduleRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.DayOfWeek;
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//public class DailyScheduleService {
//    private final DailyScheduleRepository dailyScheduleRepository;
//
//    public List<DailySchedule> getAllDailySchedules() {
//        return dailyScheduleRepository.findAll();
//    }
//
//    public Optional<DailySchedule> getDailyScheduleById(UUID id) {
//        return dailyScheduleRepository.findById(id);
//    }
//
//    public List<DailySchedule> getDailySchedulesByWeeklyScheduleId(UUID weeklyScheduleId) {
//        return dailyScheduleRepository.findByWeeklyScheduleId(weeklyScheduleId);
//    }
//
//    public Optional<DailySchedule> getDailyScheduleByWeeklyScheduleIdAndDayOfWeek(UUID weeklyScheduleId, DayOfWeek dayOfWeek) {
//        return dailyScheduleRepository.findByWeeklyScheduleIdAndDayOfWeek(weeklyScheduleId, dayOfWeek);
//    }
//
//    @Transactional
//    public DailySchedule createDailySchedule(DailySchedule dailySchedule) {
//        return dailyScheduleRepository.save(dailySchedule);
//    }
//
//    @Transactional
//    public DailySchedule updateDailySchedule(DailySchedule dailySchedule) {
//        return dailyScheduleRepository.save(dailySchedule);
//    }
//
//    @Transactional
//    public void deleteDailySchedule(UUID id) {
//        dailyScheduleRepository.deleteById(id);
//    }
//}