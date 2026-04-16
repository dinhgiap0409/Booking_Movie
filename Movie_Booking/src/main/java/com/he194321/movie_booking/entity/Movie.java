package com.he194321.movie_booking.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Movie {
    @Id
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(name = "poster_path", length = 500)
    private String posterPath;

    @Column(columnDefinition = "TEXT")
    private String overview;

    @Column(name = "release_date")
    private Date releaseDate;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @ManyToMany
    @JoinTable(
            name = "Movie_Genres",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private Set<Genre> genres = new HashSet<>();
}