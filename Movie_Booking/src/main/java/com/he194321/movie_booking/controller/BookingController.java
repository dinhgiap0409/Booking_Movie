package com.he194321.movie_booking.controller;

import com.he194321.movie_booking.dto.BookingRequest;
import com.he194321.movie_booking.entity.Booking;
import com.he194321.movie_booking.entity.Schedule;
import com.he194321.movie_booking.entity.Seat;
import com.he194321.movie_booking.entity.Ticket;
import com.he194321.movie_booking.repository.BookingRepository;
import com.he194321.movie_booking.repository.ScheduleRepository;
import com.he194321.movie_booking.repository.SeatRepository;
import com.he194321.movie_booking.repository.TicketRepository;
import com.he194321.movie_booking.repository.UserRepository;
import com.he194321.movie_booking.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/public/bookings")
@CrossOrigin("*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/hold")
    @Transactional // Đảm bảo tính toàn vẹn dữ liệu
    public ResponseEntity<?> holdSeats(@RequestBody BookingRequest request) {
        // Kiểm tra Lịch Chiếu
        Schedule schedule = scheduleRepository.findById(request.getScheduleId()).orElse(null);
        if (schedule == null)
            return ResponseEntity.badRequest().body("Lịch chiếu không hợp lệ.");

        // Chốt danh sách ghế an toàn
        List<Seat> seatsToHold = seatRepository.findAllById(request.getSeatIds());
        if (seatsToHold.size() != request.getSeatIds().size()) {
            return ResponseEntity.badRequest().body("Một số ghế không tồn tại.");
        }

        // Lấy danh sách Vé đã tồn tại của lịch chiếu này
        List<Ticket> existTickets = ticketRepository.findByScheduleId(schedule.getId());

        // Cấu hình giá tiền
        BigDecimal totalPrice = BigDecimal.ZERO;

        // Kiểm tra ghế đã bị ai mua trùng chưa (Locking mechanism cơ bản)
        for (Seat seat : seatsToHold) {
            for (Ticket t : existTickets) {
                if (t.getSeat().getId().equals(seat.getId()) && t.getBooking() != null) {
                    if ("PAID".equals(t.getBooking().getStatus()) ||
                            "PENDING".equals(t.getBooking().getStatus())) {
                        return ResponseEntity.status(409)
                                .body("Rất tiếc! Ghế " + seat.getSeatName() + " vừa bị người khác chọn mất.");
                    }
                }
            }

            // Tính số tiền
            BigDecimal currentPrice = schedule.getPrice();
            if ("VIP".equals(seat.getSeatType())) {
                currentPrice = currentPrice.add(new BigDecimal("20000")); // Phụ thu VIP
            }
            totalPrice = totalPrice.add(currentPrice);
        }

        // Tạo Hoá Đơn Booking PENDING
        Booking booking = new Booking();
        if (request.getUsername() != null && !request.getUsername().isEmpty()) {
            User user = userRepository.findByUsername(request.getUsername()).orElse(null);
            booking.setCustomer(user);
        }
        booking.setStatus("PENDING");
        booking.setTotalPrice(totalPrice);
        booking.setPaymentMethod("VN_PAY"); // Mặc định VNPAY
        booking.setBookingTime(new Date()); // Khởi tạo giờ đặt vé
        Booking savedBooking = bookingRepository.save(booking);

        // Gắn Vé vào các Ghế
        for (Seat seat : seatsToHold) {
            Ticket ticket = new Ticket();
            ticket.setBooking(savedBooking);
            ticket.setSchedule(schedule);
            ticket.setSeat(seat);
            ticket.setStatus("UNUSED");
            ticket.setQrCode(java.util.UUID.randomUUID().toString());
            ticketRepository.save(ticket);
        }

        return ResponseEntity.ok(savedBooking);
    }

    @Autowired
    private com.he194321.movie_booking.service.EmailService emailService;

    @PostMapping("/{id}/confirm-payment")
    @Transactional
    public ResponseEntity<?> confirmPayment(@PathVariable Integer id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking == null)
            return ResponseEntity.badRequest().body("Hoá đơn không tồn tại.");

        if ("CANCELLED".equals(booking.getStatus())) {
            return ResponseEntity.badRequest().body("Hoá đơn đã bị huỷ quá thời gian. Vui lòng đặt lại.");
        }

        booking.setStatus("PAID");
        bookingRepository.save(booking);
        
        emailService.sendBookingConfirmationWithQR(booking);

        return ResponseEntity.ok(booking);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getBookingHistory(@RequestParam String username) {
        List<Booking> bookings = bookingRepository.findByCustomer_UsernameOrderByBookingTimeDesc(username);
        
        List<com.he194321.movie_booking.dto.BookingHistoryDto> historyList = new java.util.ArrayList<>();
        for (Booking b : bookings) {
            com.he194321.movie_booking.dto.BookingHistoryDto dto = new com.he194321.movie_booking.dto.BookingHistoryDto();
            dto.setBookingId(b.getId());
            dto.setTotalPrice(b.getTotalPrice());
            dto.setBookingTime(b.getBookingTime());
            dto.setStatus(b.getStatus());

            List<Ticket> tickets = ticketRepository.findByBookingId(b.getId());
            if (!tickets.isEmpty()) {
                Ticket firstTicket = tickets.get(0);
                dto.setMovieTitle(firstTicket.getSchedule().getMovie().getTitle());
                dto.setMoviePoster(firstTicket.getSchedule().getMovie().getPosterPath());
                dto.setShowDate(firstTicket.getSchedule().getShowDate().toString());
                dto.setShowTime(firstTicket.getSchedule().getShowTime().toString());
                dto.setRoomName(firstTicket.getSchedule().getRoom().getName());
                dto.setMainQrCode(firstTicket.getQrCode());

                StringBuilder seats = new StringBuilder();
                for (Ticket t : tickets) {
                    seats.append(t.getSeat().getSeatName()).append(" ");
                }
                dto.setSeats(seats.toString().trim());
            }
            historyList.add(dto);
        }

        return ResponseEntity.ok(historyList);
    }
}
