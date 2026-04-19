package com.he194321.movie_booking.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookingRequest {
    private Integer scheduleId;
    private List<Integer> seatIds;
    private String username;
}
