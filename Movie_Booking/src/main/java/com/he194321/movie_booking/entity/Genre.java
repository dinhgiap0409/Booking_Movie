package com.he194321.movie_booking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Genres")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Genre {
    @Id
    private Integer id; // ID thể loại lấy từ TMDB

    @Column(nullable = false)
    private String name;
}