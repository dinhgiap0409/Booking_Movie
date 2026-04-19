package com.he194321.movie_booking.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
public class BookingHistoryDto {
    private Integer bookingId;
    private BigDecimal totalPrice;
    private Date bookingTime;
    private String status;
    private String movieTitle;
    private String moviePoster;
    private String showDate;
    private String showTime;
    private String roomName;
    private String seats;
    private String mainQrCode;
}
