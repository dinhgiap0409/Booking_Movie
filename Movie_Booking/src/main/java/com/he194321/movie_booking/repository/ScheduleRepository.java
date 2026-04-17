package com.he194321.movie_booking.repository;

import com.he194321.movie_booking.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    List<Schedule> findByMovieIdAndShowDate(Integer movieId, LocalDate showDate);
    List<Schedule> findByMovieIdAndShowDateGreaterThanEqualOrderByShowDateAscShowTimeAsc(Integer movieId, LocalDate showDate);
    List<Schedule> findByShowDate(LocalDate showDate);
}
