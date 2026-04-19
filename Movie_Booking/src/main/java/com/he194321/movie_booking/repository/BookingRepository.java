package com.he194321.movie_booking.repository;

import com.he194321.movie_booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    java.util.List<Booking> findByCustomer_UsernameOrderByBookingTimeDesc(String username);
}
