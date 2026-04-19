package com.he194321.movie_booking.repository;

import com.he194321.movie_booking.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    List<Ticket> findByScheduleId(Integer scheduleId);
    List<Ticket> findByBookingId(Integer bookingId);
    java.util.Optional<Ticket> findByQrCode(String qrCode);
}
