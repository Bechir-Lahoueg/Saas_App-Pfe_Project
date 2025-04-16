//package com.example.Schedule_Service.service;
//
//import com.example.Schedule_Service.entities.Break;
//import com.example.Schedule_Service.repository.BreakRepository;
//import jakarta.persistence.EntityNotFoundException;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.DayOfWeek;
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//public class BreakService {
//    private final BreakRepository breakRepository;
//
//    public List<Break> getAllBreaks() {
//        return breakRepository.findAll();
//    }
//
//    public Optional<Break> getBreakById(UUID id) {
//        return breakRepository.findById(id);
//    }
//
//    public List<Break> getBreaksByCalendar(UUID calendarId, boolean activeOnly) {
//        return breakRepository.findByCalendarIdAndActive(calendarId, activeOnly);
//    }
//
//    public List<Break> getBreaksByCalendarAndDay(UUID calendarId, DayOfWeek dayOfWeek) {
//        return breakRepository.findByCalendarIdAndDayOfWeekAndActive(calendarId, dayOfWeek, true);
//    }
//
//    public Break createBreak(Break Break) {
//        return breakRepository.save(Break);
//    }
//
//    public Break updateBreak(Break Break) {
//        if (!breakRepository.existsById(Break.getId())) {
//            throw new EntityNotFoundException("Break not found with ID: " + Break.getId());
//        }
//        return breakRepository.save(Break);
//    }
//
//    public void deleteBreak(UUID id) {
//        breakRepository.deleteById(id);
//    }
//}
//
