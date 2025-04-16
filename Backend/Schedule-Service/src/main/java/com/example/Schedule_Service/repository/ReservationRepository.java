//package com.example.Schedule_Service.repository;
//
//import com.example.Schedule_Service.entities.Reservation;
//import com.example.Schedule_Service.entities.TimeBlock;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.UUID;
//
//@Repository
//public interface ReservationRepository extends JpaRepository<Reservation, UUID> {
//    List<Reservation> findByCalendarId(UUID calendarId);
//
//    List<Reservation> findByTimeBlockId(UUID timeBlockId);
//
//    List<Reservation> findAll();
//
//    boolean existsById(UUID id);
//
//    List<Reservation> findByCalendarIdAndDateReservationBetween(UUID calendarId, LocalDateTime start, LocalDateTime end);
//
//    long countByTimeBlockAndDateReservation(TimeBlock timeBlock, LocalDateTime dateReservation);
//
//    long countByTimeBlockId(UUID timeBlockId);
//}