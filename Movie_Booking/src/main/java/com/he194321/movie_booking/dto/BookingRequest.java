package com.he194321.movie_booking.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookingRequest {
    private Integer scheduleId;
    private List<Integer> seatIds;
    // Tạm thời chưa cần userId nếu mua online ở chế độ Carts / Guess,
    // nhưng nếu có login thì truyền thêm userId vào đây.
}
