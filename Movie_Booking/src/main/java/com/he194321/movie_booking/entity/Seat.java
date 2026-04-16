package com.he194321.movie_booking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Seats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "seat_name", nullable = false, length = 10)
    private String seatName;

    @Column(name = "seat_type")
    private String seatType; // NORMAL, VIP
}