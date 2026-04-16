package com.he194321.movie_booking.controller;

import com.he194321.movie_booking.entity.Movie;
import com.he194321.movie_booking.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "http://localhost:5173")
public class MovieController {
    @Autowired
    private MovieService movieService;

    @GetMapping("/movies")
    public List<Movie> listMovies() {
        return movieService.getAllMovies();
    }
}
