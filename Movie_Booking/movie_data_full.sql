-- Dùng Database của bạn
USE MovieDB;
GO

-- Xoá dữ liệu cũ
DELETE FROM Schedules;
DELETE FROM Movie_Genres;
DELETE FROM Genres;
DELETE FROM Rooms;
DELETE FROM Movies;
GO

-- 1. Chèn dữ liệu Thể Loại (Genres)
INSERT INTO Genres (id, name) VALUES 
(1, 'Action'),
(2, 'Sci-Fi'),
(3, 'Thriller'),
(4, 'Drama'),
(5, 'Adventure'),
(6, 'Animation');
GO

-- 2. Chèn dữ liệu Phòng (Rooms)
SET IDENTITY_INSERT Rooms ON;
INSERT INTO Rooms (id, name, capacity) VALUES 
(1, 'Phòng 1 (2D)', 50),
(2, 'Phòng 2 (IMAX)', 100),
(3, 'Phòng 3 (3D VIP)', 30);
SET IDENTITY_INSERT Rooms OFF;
GO

-- 3. Chèn dữ liệu Phim (Movies) - Khoảng 10 phim
INSERT INTO Movies (id, title, overview, duration_minutes, release_date, poster_path) VALUES 
(1, 'Avengers: Secret Wars', N'Những siêu anh hùng mạnh nhất tập hợp vào cuộc chiến khốc liệt nhất', 150, '2026-05-02', 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop'),
(2, 'Dune: Messiah', N'Hành trình tiếp theo của Paul Atreides ở Arrakis', 165, '2026-06-15', 'https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=400&h=600&fit=crop'),
(3, 'Mission: Impossible 8', N'Nhiệm vụ bất khả thi cuối cùng của Ethan Hunt', 148, '2026-07-12', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop'),
(4, 'The Batman 2', N'Người dơi trở lại với kẻ thù đen tối hơn bao giờ hết', 170, '2026-10-02', 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop'),
(5, 'Avatar 3: Hạt Giống Thần', N'Khám phá tộc người tro cốt trên Pandora', 190, '2026-12-18', 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=600&fit=crop'),
(6, 'Jurassic World 4', N'Khủng long tái sinh trong kỷ nguyên mới', 135, '2026-08-04', 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=600&fit=crop'),
(7, 'Oppenheimer II', N'Phần hậu truyện về cuộc đời thăng trầm của J.Robert', 180, '2026-09-20', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop'),
(8, 'Inception 2: Deep Dive', N'Dom Cobb đối mặt với tầng ý thức số 5', 152, '2026-11-15', 'https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?w=400&h=600&fit=crop'),
(9, 'Spider-Man 4', N'Peter Parker bước vào cuộc sống đại học cô độc', 142, '2026-06-25', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop'),
(10, 'Toy Story 5', N'Cuộc hội ngộ cảm động của Woody và Buzz', 110, '2026-07-28', 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=600&fit=crop');
GO

-- 4. Chèn thể loại cho phim (Movie_Genres)
INSERT INTO Movie_Genres (movie_id, genre_id) VALUES
(1, 1), (1, 2), -- Avengers: Action, Sci-Fi
(2, 2),         -- Dune: Sci-Fi
(3, 1), (3, 3), -- Mission Impossible: Action, Thriller
(4, 1), (4, 4), -- The Batman: Action, Drama
(5, 5), (5, 2), -- Avatar 3: Adventure, Sci-Fi
(6, 5), (6, 1), -- Jurassic World 4: Adventure, Action
(7, 4),         -- Oppenheimer: Drama
(8, 3), (8, 2), -- Inception: Thriller, Sci-Fi
(9, 1), (9, 5), -- Spiderman: Action, Adventure
(10, 6), (10, 5); -- Toy Story 5: Animation, Adventure
GO

-- 5. Chèn dữ liệu Lịch Chiếu (Schedules) cho toàn bộ 10 phim
SET IDENTITY_INSERT Schedules ON;
INSERT INTO Schedules (id, movie_id, room_id, show_date, show_time, price) VALUES 
(1, 1, 1, CONVERT(date, GETDATE()), '18:30:00', 80000.00),         
(2, 1, 2, CONVERT(date, GETDATE()), '20:15:00', 120000.00),        
(3, 2, 2, CONVERT(date, GETDATE()), '15:30:00', 95000.00),         
(4, 3, 3, CONVERT(date, GETDATE()), '22:00:00', 150000.00),
(5, 4, 1, CONVERT(date, GETDATE()), '19:00:00', 80000.00),
(6, 5, 2, CONVERT(date, GETDATE()), '14:00:00', 120000.00),
(7, 6, 1, CONVERT(date, GETDATE()), '10:00:00', 65000.00),
(8, 7, 2, CONVERT(date, GETDATE()), '21:30:00', 120000.00),
(9, 8, 3, CONVERT(date, GETDATE()), '22:45:00', 150000.00),
(10, 9, 1, CONVERT(date, GETDATE()), '16:00:00', 80000.00),
(11, 10, 1, CONVERT(date, GETDATE()), '09:00:00', 65000.00),
-- Suất ngày mai
(12, 1, 1, CONVERT(date, GETDATE()+1), '14:00:00', 80000.00),       
(13, 2, 2, CONVERT(date, GETDATE()+1), '19:00:00', 120000.00),
(14, 5, 2, CONVERT(date, GETDATE()+1), '20:00:00', 120000.00);       
SET IDENTITY_INSERT Schedules OFF;
GO
