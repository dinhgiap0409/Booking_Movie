package com.he194321.movie_booking.config;

import com.he194321.movie_booking.entity.Movie;
import com.he194321.movie_booking.entity.Room;
import com.he194321.movie_booking.entity.Schedule;
import com.he194321.movie_booking.entity.Seat;
import com.he194321.movie_booking.repository.MovieRepository;
import com.he194321.movie_booking.repository.RoomRepository;
import com.he194321.movie_booking.repository.ScheduleRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class ScheduleGeneratorTask {

    @Autowired
    private ScheduleRepository scheduleRepository;
    
    @Autowired
    private MovieRepository movieRepository;
    
    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private com.he194321.movie_booking.repository.SeatRepository seatRepository;

    // Chạy ngay khi ứng dụng khởi động
    @PostConstruct
    public void init() {
        generateMissingSeats();
        generateMissingSchedules();
    }

    public void generateMissingSeats() {
        List<Room> rooms = roomRepository.findAll();
        for (Room r : rooms) {
            List<Seat> seats = seatRepository.findByRoomId(r.getId());
            if (seats.isEmpty()) {
                System.out.println("⏳ Đang tạo sơ đồ ghế tự động cho phòng: " + r.getName());
                List<Seat> newSeats = new ArrayList<>();
                // 5 hàng (A-E), mỗi hàng 10 ghế
                char[] rows = {'A', 'B', 'C', 'D', 'E'};
                for (char row : rows) {
                    for (int i = 1; i <= 10; i++) {
                        String type = (row == 'D' || row == 'E') ? "VIP" : "NORMAL";
                        newSeats.add(new Seat(null, r, row + String.valueOf(i), type));
                    }
                }
                seatRepository.saveAll(newSeats);
            }
        }
    }

    // Chạy ngầm vào lúc 00:01 mỗi đêm để nạp thêm lịch chiếu cho các ngày kế tiếp
    @Scheduled(cron = "0 1 0 * * ?")
    public void generateMissingSchedules() {
        List<Movie> movies = movieRepository.findAll();
        List<Room> rooms = roomRepository.findAll();
        
        if (movies.isEmpty() || rooms.isEmpty()) return;

        Random rand = new Random();
        List<Schedule> newSchedules = new ArrayList<>();
        
        // Cấu hình các khung giờ vàng chiếu phim
        LocalTime[] baseTimes = {
            LocalTime.of(9, 30), 
            LocalTime.of(14, 0), 
            LocalTime.of(18, 30), 
            LocalTime.of(20, 15), 
            LocalTime.of(22, 0)
        };

        // Quét 7 ngày liên tiếp tính từ hôm nay tới nguyên tuần sau
        for (int i = 0; i < 7; i++) {
            LocalDate targetDate = LocalDate.now().plusDays(i);
            
            // Nếu phát hiện ngày này database trống
            List<Schedule> existForDate = scheduleRepository.findByShowDate(targetDate);
            if (existForDate == null || existForDate.isEmpty()) {
                System.out.println("⏳ Đang tự động bơm lịch chiếu phim cho ngày: " + targetDate);
                
                // Lặp qua tất cả các phim đang có trong cơ sở dữ liệu
                for (Movie m : movies) {
                    
                    // Lấy ngẫu nhiên ra 1 -> 3 suất chiếu mỗi phim
                    int numSchedules = rand.nextInt(3) + 1; 
                    
                    for (int j = 0; j < numSchedules; j++) {
                        Room r = rooms.get(rand.nextInt(rooms.size()));
                        LocalTime t = baseTimes[rand.nextInt(baseTimes.length)].plusMinutes(rand.nextInt(3) * 15);
                        BigDecimal price = new BigDecimal(r.getName().contains("IMAX") ? "120000" : "80000");

                        newSchedules.add(new Schedule(null, m, r, targetDate, t, price));
                    }
                }
            }
        }
        
        // Lưu 1 cục vào database
        if (!newSchedules.isEmpty()) {
            scheduleRepository.saveAll(newSchedules);
        }
    }
}
