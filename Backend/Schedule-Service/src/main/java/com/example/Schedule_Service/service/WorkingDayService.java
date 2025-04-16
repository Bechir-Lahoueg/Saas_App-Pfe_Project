package com.example.Schedule_Service.service;

import com.example.Schedule_Service.entities.TimeSlot;
import com.example.Schedule_Service.entities.WorkingDay;
import com.example.Schedule_Service.repository.WorkingDayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WorkingDayService {

    private final WorkingDayRepository workingDayRepository;

    public List<WorkingDay> getAllWorkingDays() {
        return workingDayRepository.findAll();
    }

    public Optional<WorkingDay> getWorkingDayById(Long id) {
        return workingDayRepository.findById(id);
    }

    public WorkingDay createWorkingDay(WorkingDay workingDay) {
        return workingDayRepository.save(workingDay);
    }

    public void deleteWorkingDay(Long id) {
        if (workingDayRepository.existsById(id)) {
            workingDayRepository.deleteById(id);
        } else {
            throw new RuntimeException("Working day not found");
        }
    }

    public WorkingDay updateWorkingDay(Long id, WorkingDay workingDay) {
        if (workingDayRepository.existsById(id)) {
            workingDay.setId(id);
            return workingDayRepository.save(workingDay);
        } else {
            throw new RuntimeException("Working day not found");
        }
    }

    @Transactional
    public Optional<WorkingDay> addTimeSlotToWorkingDay(Long id, TimeSlot timeSlot) {
        return workingDayRepository.findById(id)
                .map(workingDay -> {
                    workingDay.getTimeSlots().add(timeSlot);
                    return workingDayRepository.save(workingDay);
                });
    }

    @Transactional
    public Optional<WorkingDay> removeTimeSlotFromWorkingDay(Long id, int timeSlotId) {
        return workingDayRepository.findById(id)
                .map(workingDay -> {
                    if (timeSlotId >= 0 && timeSlotId < workingDay.getTimeSlots().size()) {
                        workingDay.getTimeSlots().remove(timeSlotId);
                    }
                    return workingDayRepository.save(workingDay);
                });
    }
}
