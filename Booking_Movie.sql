-- =========================================================================
-- KHỞI TẠO CƠ SỞ DỮ LIỆU
-- =========================================================================
USE master;
GO
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'MovieDB')
BEGIN
    CREATE DATABASE MovieDB;
END
GO
USE MovieDB;
GO

-- =========================================================================
-- GIAI ĐOẠN 1: QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN (Auth)
-- =========================================================================
CREATE TABLE Roles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name NVARCHAR(100),
    phone VARCHAR(15),
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE User_Roles (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(id) ON DELETE CASCADE
);

-- Thêm 3 quyền mặc định
INSERT INTO Roles (name) VALUES ('ROLE_ADMIN'), ('ROLE_STAFF'), ('ROLE_CUSTOMER');
GO

-- =========================================================================
-- GIAI ĐOẠN 2: QUẢN LÝ PHIM & RẠP CHIẾU (Catalog)
-- =========================================================================
-- Bảng Phim (Lưu dữ liệu lấy từ TMDB)
CREATE TABLE Movies (
    id INT PRIMARY KEY, -- Sử dụng luôn ID của TMDB để dễ lấy ảnh/trailer
    title NVARCHAR(255) NOT NULL,
    poster_path NVARCHAR(500),
    overview NVARCHAR(MAX),
    release_date DATE,
    duration_minutes INT -- Thời lượng phim (phút)
);

-- Bảng Thể loại phim
CREATE TABLE Genres (
    id INT PRIMARY KEY, -- Dùng ID của TMDB
    name NVARCHAR(100) NOT NULL
);

-- Bảng trung gian Phim - Thể loại (1 phim có nhiều thể loại)
CREATE TABLE Movie_Genres (
    movie_id INT,
    genre_id INT,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES Genres(id) ON DELETE CASCADE
);

-- Bảng Phòng chiếu
CREATE TABLE Rooms (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL, -- Ví dụ: Phòng 1, Phòng 2, Phòng VIP
    capacity INT NOT NULL -- Sức chứa (Số lượng ghế)
);

-- Bảng Ghế ngồi trong từng phòng
CREATE TABLE Seats (
    id INT IDENTITY(1,1) PRIMARY KEY,
    room_id INT,
    seat_name VARCHAR(10) NOT NULL, -- Ví dụ: A1, B5, C10
    seat_type VARCHAR(50) DEFAULT 'NORMAL', -- NORMAL (Thường), VIP, SWEETBOX
    FOREIGN KEY (room_id) REFERENCES Rooms(id) ON DELETE CASCADE
);
GO

-- =========================================================================
-- GIAI ĐOẠN 3 & 4: SUẤT CHIẾU, ĐẶT VÉ & THANH TOÁN (Core & Sales)
-- =========================================================================
-- Bảng Lịch chiếu (Suất chiếu)
CREATE TABLE Schedules (
    id INT IDENTITY(1,1) PRIMARY KEY,
    movie_id INT,
    room_id INT,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- Giá vé cơ bản cho suất chiếu này
    FOREIGN KEY (movie_id) REFERENCES Movies(id),
    FOREIGN KEY (room_id) REFERENCES Rooms(id)
);

-- Bảng Đơn đặt vé (Hóa đơn chung)
CREATE TABLE Bookings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT, -- Người đặt mua (NULL nếu là khách vãng lai mua tại quầy)
    staff_id INT,    -- Nhân viên bán (NULL nếu khách tự đặt online)
    booking_time DATETIME DEFAULT GETDATE(),
    total_price DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50), -- VNPAY, MOMO, CASH (Tiền mặt)
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING (Chờ thanh toán), PAID (Đã thanh toán), CANCELLED (Đã hủy)
    FOREIGN KEY (customer_id) REFERENCES Users(id),
    FOREIGN KEY (staff_id) REFERENCES Users(id)
);

-- Bảng Chi tiết vé (Mỗi vé tương ứng 1 ghế của 1 hóa đơn)
CREATE TABLE Tickets (
    id INT IDENTITY(1,1) PRIMARY KEY,
    booking_id INT,
    schedule_id INT,
    seat_id INT,
    qr_code VARCHAR(255) UNIQUE, -- Mã QR để quét khi vào rạp
    status VARCHAR(50) DEFAULT 'UNUSED', -- UNUSED (Chưa dùng), USED (Đã vào rạp)
    FOREIGN KEY (booking_id) REFERENCES Bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES Schedules(id),
    FOREIGN KEY (seat_id) REFERENCES Seats(id)
);
GO