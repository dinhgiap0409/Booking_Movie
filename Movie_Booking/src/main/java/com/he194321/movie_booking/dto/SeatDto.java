package com.he194321.movie_booking.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatDto {
    private Integer id;
    private String seatName;
    private String seatType; // NORMAL, VIP
    private String status;   // AVAILABLE, PENDING, PAID
}
