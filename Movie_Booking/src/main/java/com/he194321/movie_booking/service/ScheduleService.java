package com.he194321.movie_booking.service;

import com.he194321.movie_booking.entity.Schedule;
import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {
    List<Schedule> getSchedulesByMovieAndDate(Integer movieId, LocalDate date);
    List<Schedule> getUpcomingSchedulesByMovie(Integer movieId);
}
