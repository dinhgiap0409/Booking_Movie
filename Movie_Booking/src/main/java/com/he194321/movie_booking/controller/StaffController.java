package com.he194321.movie_booking.controller;

import com.he194321.movie_booking.entity.Ticket;
import com.he194321.movie_booking.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/staff/tickets")
@CrossOrigin("*")
public class StaffController {

    @Autowired
    private TicketRepository ticketRepository;

    @PostMapping("/scan")
    @Transactional
    public ResponseEntity<?> scanTicketQr(@RequestParam String qrCode) {
        // Tìm vé trong DB dựa vào chuỗi mã QR
        Ticket ticket = ticketRepository.findByQrCode(qrCode).orElse(null);

        if (ticket == null) {
            return ResponseEntity.status(404).body("Mã QR không hợp lệ hoặc vé không tồn tại trên hệ thống!");
        }

        if (!"PAID".equals(ticket.getBooking().getStatus())) {
            return ResponseEntity.badRequest().body("Vé này thuộc hóa đơn chưa thanh toán hoặc đã bị hủy hợp lệ!");
        }

        if ("USED".equals(ticket.getStatus())) {
            return ResponseEntity.status(409).body("Rất tiếc! Vé này đã ĐƯỢC QUÉT VÀ SỬ DỤNG trước đó rồi.");
        }

        // Cập nhật trạng thái thành Đã sử dụng
        ticket.setStatus("USED");
        ticketRepository.save(ticket);

        return ResponseEntity.ok("Quét thành công! Xin mời khách vào rạp: " 
                + ticket.getSchedule().getRoom().getName() 
                + " | Ghế: " + ticket.getSeat().getSeatName());
    }
}
