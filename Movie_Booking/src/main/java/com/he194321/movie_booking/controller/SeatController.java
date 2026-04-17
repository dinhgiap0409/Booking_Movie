package com.he194321.movie_booking.controller;

import com.he194321.movie_booking.dto.SeatDto;
import com.he194321.movie_booking.entity.Schedule;
import com.he194321.movie_booking.entity.Seat;
import com.he194321.movie_booking.entity.Ticket;
import com.he194321.movie_booking.repository.ScheduleRepository;
import com.he194321.movie_booking.repository.SeatRepository;
import com.he194321.movie_booking.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/public/seats")
@CrossOrigin("*")
public class SeatController {

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<?> getSeatsForSchedule(@PathVariable Integer scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId).orElse(null);
        if (schedule == null) {
            return ResponseEntity.badRequest().body("Lịch chiếu không tồn tại!");
        }

        List<Seat> roomSeats = seatRepository.findByRoomId(schedule.getRoom().getId());
        List<Ticket> soldTickets = ticketRepository.findByScheduleId(scheduleId);

        List<SeatDto> result = new ArrayList<>();

        for (Seat seat : roomSeats) {
            String status = "AVAILABLE";
            
            // Tìm xem ghế này đã có ai đặt trong suất chiếu này chưa
            for (Ticket t : soldTickets) {
                if (t.getSeat().getId().equals(seat.getId()) && t.getBooking() != null) {
                    if ("PAID".equals(t.getBooking().getStatus())) {
                        status = "PAID";
                        break;
                    } else if ("PENDING".equals(t.getBooking().getStatus())) {
                        status = "PENDING";
                        break;
                    }
                }
            }
            
            result.add(new SeatDto(seat.getId(), seat.getSeatName(), seat.getSeatType(), status));
        }

        return ResponseEntity.ok(result);
    }
}
