package com.he194321.movie_booking.service;

import com.he194321.movie_booking.entity.Booking;
import com.he194321.movie_booking.entity.Ticket;
import com.he194321.movie_booking.entity.User;
import com.he194321.movie_booking.repository.TicketRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TicketRepository ticketRepository;

    public void sendBookingConfirmationWithQR(Booking booking) {
        User customer = booking.getCustomer();
        if (customer == null || customer.getEmail() == null || customer.getEmail().isEmpty()) {
            System.out.println("Không có địa chỉ email để gửi vé cho Booking ID: " + booking.getId());
            return;
        }

        List<Ticket> tickets = ticketRepository.findByBookingId(booking.getId());
        if (tickets.isEmpty()) return;

        MimeMessage message = mailSender.createMimeMessage();
        
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("MovieBookingSystem <no-reply@moviebooking.com>");
            helper.setTo(customer.getEmail());
            helper.setSubject("🎟️ Xác Nhận Đặt Vé Phim Thành Công - Đơn Mua #" + booking.getId());

            StringBuilder seatsList = new StringBuilder();
            // Lấy QR Code của vé đầu tiên làm QR đại diện (hoặc có thể dùng Booking ID làm QR)
            // Ở đây vì mỗi ghế 1 thẻ Ticket, mình lấy Ticket của hệ thống
            String mainQrCode = tickets.get(0).getQrCode();
            
            for (Ticket t : tickets) {
                seatsList.append(t.getSeat().getSeatName()).append(" ");
            }

            String qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + mainQrCode;
            
            String scheduleDate = tickets.get(0).getSchedule().getShowDate().toString();
            String scheduleTime = tickets.get(0).getSchedule().getShowTime().toString();
            String movieName = tickets.get(0).getSchedule().getMovie().getTitle();
            String roomName = tickets.get(0).getSchedule().getRoom().getName();

            // Đọc giao diện Email từ file HTML riêng biệt (Chuẩn mô hình tách biệt Giao diện và Logic)
            String content = "";
            try {
                org.springframework.core.io.ClassPathResource resource = new org.springframework.core.io.ClassPathResource("templates/ticket-email.html");
                byte[] byteData = org.springframework.util.FileCopyUtils.copyToByteArray(resource.getInputStream());
                content = new String(byteData, java.nio.charset.StandardCharsets.UTF_8);
            } catch (Exception e) {
                System.err.println("Không tìm thấy file giao diện email: " + e.getMessage());
                return; // Dừng lại nếu lỗi template
            }

            // Tiêm dữ liệu vào các ô trống {{...}} trong file HTML
            content = content.replace("{{customerName}}", customer.getUsername() != null ? customer.getUsername() : "Khách hàng");
            content = content.replace("{{movieName}}", movieName);
            content = content.replace("{{scheduleDate}}", scheduleDate);
            content = content.replace("{{scheduleTime}}", scheduleTime);
            content = content.replace("{{roomName}}", roomName);
            content = content.replace("{{seatsList}}", seatsList.toString());
            content = content.replace("{{totalPrice}}", booking.getTotalPrice().toString());
            content = content.replace("{{qrUrl}}", qrUrl);

            helper.setText(content, true);

            // Gửi email ở 1 luồng riêng để không chặn Frontend response
            new Thread(() -> {
                try {
                    mailSender.send(message);
                    System.out.println("Đã gửi email Ticket cho: " + customer.getEmail());
                } catch (Exception e) {
                    System.err.println("Lỗi gửi email: " + e.getMessage());
                }
            }).start();
            
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
