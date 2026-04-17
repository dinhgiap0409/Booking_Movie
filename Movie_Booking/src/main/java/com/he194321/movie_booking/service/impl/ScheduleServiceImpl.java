package com.he194321.movie_booking.service.impl;

import com.he194321.movie_booking.entity.Schedule;
import com.he194321.movie_booking.repository.ScheduleRepository;
import com.he194321.movie_booking.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Override
    public List<Schedule> getSchedulesByMovieAndDate(Integer movieId, LocalDate date) {
        return scheduleRepository.findByMovieIdAndShowDate(movieId, date);
    }

    @Override
    public List<Schedule> getUpcomingSchedulesByMovie(Integer movieId) {
        return scheduleRepository.findByMovieIdAndShowDateGreaterThanEqualOrderByShowDateAscShowTimeAsc(movieId, LocalDate.now());
    }
}
