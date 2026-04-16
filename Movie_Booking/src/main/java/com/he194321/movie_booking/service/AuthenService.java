package com.he194321.movie_booking.service;

import com.he194321.movie_booking.dto.RegisterRequest;
import com.he194321.movie_booking.entity.User;

public interface AuthenService {
    String register(RegisterRequest userRequest);
}
