package com.he194321.movie_booking.controller;

import com.he194321.movie_booking.entity.Schedule;
import com.he194321.movie_booking.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/public/schedules")
@CrossOrigin(origins = "http://localhost:5173")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("/movie/{movieId}")
    public List<Schedule> getSchedulesByMovie(
            @PathVariable Integer movieId,
            @RequestParam(required = false) String date) {
        if (date != null && !date.isEmpty()) {
            return scheduleService.getSchedulesByMovieAndDate(movieId, LocalDate.parse(date));
        }
        return scheduleService.getUpcomingSchedulesByMovie(movieId);
    }
}
