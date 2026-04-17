package com.he194321.movie_booking.config;

import com.he194321.movie_booking.entity.Booking;
import com.he194321.movie_booking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Component
public class BookingCleanupTask {

    @Autowired
    private BookingRepository bookingRepository;

    // Chạy mỗi phút 1 lần để dọn dẹp các Hoá Đơn bị "Treo" do khách không thanh toán
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void releaseExpiredBookings() {
        // Lấy toàn bộ các bill đang PENDING
        List<Booking> pendingBookings = bookingRepository.findAll();
        
        long currentTime = new Date().getTime();
        int cancelCount = 0;

        for (Booking b : pendingBookings) {
            if ("PENDING".equals(b.getStatus()) && b.getBookingTime() != null) {
                long diffMinutes = (currentTime - b.getBookingTime().getTime()) / (60 * 1000);
                
                // Nếu quá 5 phút mà vẫn PENDING thì huỷ luôn
                if (diffMinutes >= 5) {
                    b.setStatus("CANCELLED");
                    bookingRepository.save(b);
                    cancelCount++;
                }
            }
        }
        
        if (cancelCount > 0) {
            System.out.println("Đã tự động huỷ và giải phóng ghế cho " + cancelCount + " đơn hàng hết hạn 5 phút.");
        }
    }
}
