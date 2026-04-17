package com.he194321.movie_booking.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "Bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer; // Ai mua (NULL nếu mua tại quầy không cần tài khoản)

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private User staff; // Ai bán (NULL nếu khách tự đặt online)

    @Column(name = "booking_time")
    private Date bookingTime;

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;

    @Column(name = "payment_method")
    private String paymentMethod;

    private String status; // PENDING, PAID, CANCELLED
}