import React, { useState, useEffect, useRef } from 'react';
import '../styles/Dashboard.css';
import api from '../api/axiosConfig';
import Footer from '../components/layout/Footer';
import ScheduleModal from '../components/booking/ScheduleModal';
import SeatMapModal from '../components/booking/SeatMapModal';
import {
    Film, Ticket, Search, Clock, Calendar, Star,
    ChevronLeft, ChevronRight, Play, TrendingUp, Flame,
    Popcorn, Sparkles, X
} from 'lucide-react';

// ===================== MOCK DATA (fallback khi chưa có API) =====================
const MOCK_MOVIES = [
    {
        id: 1, title: "Avengers: Secret Wars", durationMinutes: 150,
        releaseDate: "2026-05-02", genre: "Action",
        rating: 9.2, votes: 12400,
        posterPath: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
        overview: "Những siêu anh hùng mạnh nhất vũ trụ tập hợp trong cuộc chiến định mệnh cuối cùng chống lại thế lực tối thượng.",
        isHot: true,
    },
    {
        id: 2, title: "Dune: Messiah", durationMinutes: 165,
        releaseDate: "2026-06-15", genre: "Sci-Fi",
        rating: 8.9, votes: 9800,
        posterPath: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=400&h=600&fit=crop",
        overview: "Paul Atreides đối mặt với số phận của mình trên hành tinh Arrakis khi đế chế mới hình thành.",
        isHot: true,
    },
    {
        id: 3, title: "Mission: Impossible 8", durationMinutes: 148,
        releaseDate: "2026-07-12", genre: "Thriller",
        rating: 8.5, votes: 7650,
        posterPath: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
        overview: "Ethan Hunt và đội IMF đối mặt nhiệm vụ bất khả thi nhất trong lịch sử của họ.",
        isHot: true,
    },
    {
        id: 4, title: "The Batman 2", durationMinutes: 172,
        releaseDate: "2026-10-03", genre: "Action",
        rating: 8.7, votes: 11200,
        posterPath: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
        overview: "Người Dơi tiếp tục cuộc chiến chống lại tội phạm Gotham trong bóng tối sâu thẳm hơn bao giờ hết.",
        isHot: false,
    },
    {
        id: 5, title: "Avatar 3", durationMinutes: 190,
        releaseDate: "2026-12-20", genre: "Sci-Fi",
        rating: 8.3, votes: 8900,
        posterPath: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=600&fit=crop",
        overview: "Jake Sully dẫn dắt người Na'vi trong cuộc kháng chiến chống lại đế quốc xâm lược cuối cùng.",
        isHot: false,
    },
    {
        id: 6, title: "Jurassic World 4", durationMinutes: 138,
        releaseDate: "2026-07-04", genre: "Adventure",
        rating: 7.8, votes: 6200,
        posterPath: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=600&fit=crop",
        overview: "Những sinh vật tiền sử trỗi dậy trở lại, đe dọa nền văn minh nhân loại từ góc độ hoàn toàn mới.",
        isHot: false,
    },
    {
        id: 7, title: "Oppenheimer II", durationMinutes: 182,
        releaseDate: "2026-08-21", genre: "Drama",
        rating: 9.0, votes: 14300,
        posterPath: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop",
        overview: "Chương tiếp theo khám phá hậu quả của vụ thử nghiệm hạt nhân thay đổi lịch sử loài người.",
        isHot: true,
    },
    {
        id: 8, title: "Inception 2", durationMinutes: 158,
        releaseDate: "2026-09-18", genre: "Thriller",
        rating: 9.1, votes: 15700,
        posterPath: "https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?w=400&h=600&fit=crop",
        overview: "Dom Cobb trở lại với nhiệm vụ xâm nhập tâm trí phức tạp nhất mà loài người từng biết đến.",
        isHot: true,
    },
];

const GENRES = ['Tất cả', 'Action', 'Sci-Fi', 'Thriller', 'Drama', 'Adventure', 'Animation'];

const GENRE_VI = {
    'Action': 'Hành Động', 'Sci-Fi': 'Khoa Học', 'Thriller': 'Hồi Hộp',
    'Drama': 'Tâm Lý', 'Adventure': 'Phiêu Lưu', 'Animation': 'Hoạt Hình',
    'Tất cả': 'Tất Cả',
};

// ===================== STAR RATING =====================
const StarRating = ({ rating }) => {
    const stars = Math.round(rating / 2);
    return (
        <div className="star-row">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={12} className={i <= stars ? 'star-filled' : 'star-empty'} />
            ))}
            <span className="rating-num">{rating}</span>
        </div>
    );
};

// ===================== HERO CAROUSEL =====================
const HeroCarousel = ({ movies, onBook }) => {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef(null);
    const hotMovies = movies.slice(0, 5);
    if (!hotMovies.length) return null;

    const goTo = (idx) => setCurrent((idx + hotMovies.length) % hotMovies.length);
    const resetTimer = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setCurrent(p => (p + 1) % hotMovies.length), 5000);
    };
    useEffect(() => { resetTimer(); return () => clearInterval(timerRef.current); }, [hotMovies.length]);
    const handleNav = (dir) => { goTo(current + dir); resetTimer(); };

    const movie = hotMovies[current];

    return (
        <div className="hero-wrap">
            {/* Background */}
            {hotMovies.map((m, i) => (
                <div key={m.id} className={`hero-bg ${i === current ? 'hero-bg--active' : ''}`}
                    style={{ backgroundImage: `url(${m.posterPath})` }} />
            ))}
            <div className="hero-overlay" />

            {/* Content */}
            <div className="hero-content">
                <div className="hero-badge"><Flame size={14} /> #HOT {current + 1} TRENDING</div>
                <h1 className="hero-title">{movie.title}</h1>
                <div className="hero-meta">
                    <span className="hero-genre">{GENRE_VI[movie.genre] || movie.genre}</span>
                    <span className="hero-dot" />
                    <Clock size={14} /> {movie.durationMinutes} phút
                    <span className="hero-dot" />
                    <Calendar size={14} /> {movie.releaseDate}
                    <span className="hero-dot" />
                    <Star size={14} className="star-gold" /> {movie.rating}/10
                </div>
                <p className="hero-overview">{movie.overview}</p>
                <div className="hero-actions">
                    <button className="btn-primary"><Play size={18} /> Xem Trailer</button>
                    <button className="btn-outline" onClick={() => onBook(movie)}><Ticket size={18} /> Đặt Vé Ngay</button>
                </div>
            </div>

            {/* Nav */}
            <button className="hero-nav hero-nav--left" onClick={() => handleNav(-1)}><ChevronLeft size={22} /></button>
            <button className="hero-nav hero-nav--right" onClick={() => handleNav(1)}><ChevronRight size={22} /></button>

            {/* Dots */}
            <div className="hero-dots">
                {hotMovies.map((_, i) => (
                    <button key={i} className={`hero-dot-btn ${i === current ? 'hero-dot-btn--active' : ''}`}
                        onClick={() => { goTo(i); resetTimer(); }} />
                ))}
            </div>

            {/* Thumbnails */}
            <div className="hero-thumbs">
                {hotMovies.map((m, i) => (
                    <div key={m.id} className={`hero-thumb ${i === current ? 'hero-thumb--active' : ''}`}
                        onClick={() => { goTo(i); resetTimer(); }}>
                        <img src={m.posterPath} alt={m.title} />
                        <div className="hero-thumb-overlay">
                            <p>{m.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ===================== MOVIE CARD =====================
const MovieCard = ({ movie, onBook }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div className={`card ${hovered ? 'card--hovered' : ''}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>

            {/* Poster */}
            <div className="card-poster">
                <img src={movie.posterPath || 'https://via.placeholder.com/300x450?text=No+Poster'}
                    alt={movie.title} className="card-img" />
                <div className="card-poster-overlay">
                    <div className="card-play"><Play size={28} /></div>
                    <p className="card-overview">{movie.overview || 'Chưa có mô tả.'}</p>
                </div>
                {movie.isHot && <div className="card-badge card-badge--hot"><Flame size={10} /> HOT</div>}
                <div className="card-badge card-badge--rating">
                    <Star size={10} className="star-gold" /> {movie.rating}
                </div>
            </div>

            {/* Info */}
            <div className="card-body">
                <span className="card-genre">{GENRE_VI[movie.genre] || movie.genre}</span>
                <h3 className="card-title">{movie.title}</h3>
                <StarRating rating={movie.rating} />
                <div className="card-meta">
                    <div className="card-meta-item"><Clock size={12} />{movie.durationMinutes}p</div>
                    <div className="card-meta-item"><Calendar size={12} />{movie.releaseDate?.slice(0, 7)}</div>
                    <div className="card-meta-item"><TrendingUp size={12} />{(movie.votes / 1000).toFixed(1)}K</div>
                </div>
                <button className="btn-book" onClick={() => onBook(movie)}>
                    <Ticket size={15} /> ĐẶT VÉ NGAY
                </button>
            </div>
        </div>
    );
};

// ===================== STATS BAR =====================
const StatsBar = ({ movies }) => (
    <div className="stats-bar">
        <div className="stat-item">
            <Film size={22} className="stat-icon stat-icon--red" />
            <div><div className="stat-num">{movies.length}+</div><div className="stat-label">Phim Đang Chiếu</div></div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
            <Ticket size={22} className="stat-icon stat-icon--amber" />
            <div><div className="stat-num">12+</div><div className="stat-label">Rạp Chiếu Phim</div></div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
            <Star size={22} className="stat-icon stat-icon--gold" />
            <div><div className="stat-num">50K+</div><div className="stat-label">Khán Giả Hài Lòng</div></div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
            <Sparkles size={22} className="stat-icon stat-icon--purple" />
            <div><div className="stat-num">4K</div><div className="stat-label">Chất Lượng Hình Ảnh</div></div>
        </div>
    </div>
);

// ===================== MAIN DASHBOARD =====================
const Dashboard = ({ preSelectedMovie, preSelectedSchedule, onBackToShowtimes }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeGenre, setActiveGenre] = useState('Tất cả');
    const [sortBy, setSortBy] = useState('rating');
    const [selectedMovie, setSelectedMovie] = useState(preSelectedMovie || null);
    const [schedules, setSchedules] = useState([]);
    const [loadingSchedules, setLoadingSchedules] = useState(false);
    const [scheduleDate, setScheduleDate] = useState('');

    const [selectedSchedule, setSelectedSchedule] = useState(preSelectedSchedule || null);
    const [seats, setSeats] = useState([]);
    const [loadingSeats, setLoadingSeats] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const fetchSeats = async (schedule) => {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined' || token === 'null') {
            alert('⚠️ Vui lòng ĐĂNG NHẬP để có thể truy cập hệ thống phòng chiếu và chọn ghế!');
            if (window.goToLogin) window.goToLogin();
            return;
        }

        setSelectedSchedule(schedule);
        setLoadingSeats(true);
        setSelectedSeats([]);
        try {
            const res = await api.get(`/public/seats/schedule/${schedule.id}`);
            setSeats(res.data);
        } catch (e) {
            console.error('Failed to fetch seats', e);
            setSeats([]);
        } finally {
            setLoadingSeats(false);
        }
    };

    useEffect(() => {
        if (preSelectedMovie) setSelectedMovie(preSelectedMovie);
        if (preSelectedSchedule) fetchSeats(preSelectedSchedule);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preSelectedMovie, preSelectedSchedule]);

    const toggleSeat = (seat) => {
        if (seat.status !== 'AVAILABLE') return;
        const exists = selectedSeats.find(s => s.id === seat.id);
        if (exists) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        } else {
            if (selectedSeats.length >= 8) {
                alert('Chỉ được chọn tối đa 8 ghế!');
                return;
            }
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const calculateTotal = () => {
        let total = 0;
        const basePrice = selectedSchedule?.price || 80000;
        selectedSeats.forEach(s => {
            total += s.seatType === 'VIP' ? basePrice + 20000 : basePrice;
        });
        return total;
    };

    const checkSingleSeatGap = (selected) => {
        if (selected.length === 0) return null;
        const rows = {};
        seats.forEach(s => {
            const r = s.seatName.charAt(0);
            if (!rows[r]) rows[r] = [];
            rows[r].push(s);
        });

        for (let r in rows) {
            let rowSeats = rows[r].sort((a, b) => parseInt(a.seatName.substring(1)) - parseInt(b.seatName.substring(1)));

            for (let i = 0; i < rowSeats.length; i++) {
                let s = rowSeats[i];
                let isSelectedByUser = selected.some(sel => sel.id === s.id);
                let isEmpty = s.status === 'AVAILABLE' && !isSelectedByUser;

                if (isEmpty) {
                    let leftOccupied = (i === 0) || (rowSeats[i - 1].status !== 'AVAILABLE' || selected.some(sel => sel.id === rowSeats[i - 1].id));
                    let rightOccupied = (i === rowSeats.length - 1) || (rowSeats[i + 1].status !== 'AVAILABLE' || selected.some(sel => sel.id === rowSeats[i + 1].id));

                    if (leftOccupied && rightOccupied) {
                        let leftWasOccupied = (i === 0) || (rowSeats[i - 1].status !== 'AVAILABLE');
                        let rightWasOccupied = (i === rowSeats.length - 1) || (rowSeats[i + 1].status !== 'AVAILABLE');

                        if (!leftWasOccupied || !rightWasOccupied) {
                            return s.seatName;
                        }
                    }
                }
            }
        }
        return null;
    };

    const handleHoldSeats = async () => {
        const gapSeat = checkSingleSeatGap(selectedSeats);
        if (gapSeat) {
            alert(`⚠️ Không thể ghép ghế như vậy! Việc chọn của bạn làm tạo ra một khoảng trống duy nhất tại ghế [${gapSeat}]. Vui lòng chọn ghế liền kề nhau để không để lại 1 ghế thừa nhé!`);
            return;
        }

        try {
            const payload = {
                scheduleId: selectedSchedule.id,
                seatIds: selectedSeats.map(s => s.id)
            };
            const res = await api.post('/public/bookings/hold', payload);
            alert('🎉 GIỮ CHỖ THÀNH CÔNG! Hóa đơn: ' + res.data.id + '\nTổng tiền: ' + res.data.totalPrice + ' VND.\n(Hệ thống sẽ chuyển sang cổng thanh toán VNPAY...)');
            fetchSeats(selectedSchedule);
        } catch (error) {
            console.error(error);
            alert(error.response?.data || 'Đã có lỗi xảy ra. Vui lòng chọn ghế khác!');
        }
    };

    const fetchSchedules = async (movieId, date = '') => {
        setLoadingSchedules(true);
        try {
            const url = date ? `/public/schedules/movie/${movieId}?date=${date}` : `/public/schedules/movie/${movieId}`;
            const res = await api.get(url);
            setSchedules(res.data);
        } catch (e) {
            console.error('Failed to fetch schedules', e);
            setSchedules([]);
        } finally {
            setLoadingSchedules(false);
        }
    };

    const handleBook = (movie) => {
        setSelectedMovie(movie);
        setScheduleDate('');
        fetchSchedules(movie.id, '');
    };

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await api.get('/public/movies');
                const data = response.data;
                const mappedData = data.map(m => ({
                    ...m,
                    genre: m.genres && m.genres.length > 0 ? m.genres[0].name : (m.genre || 'Action'),
                    rating: m.rating || (Math.random() * 2 + 7).toFixed(1),
                    votes: m.votes || Math.floor(Math.random() * 5000) + 5000,
                    isHot: m.isHot !== undefined ? m.isHot : true
                }));
                setMovies(mappedData.length ? mappedData : MOCK_MOVIES);
            } catch {
                setMovies(MOCK_MOVIES);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    const filtered = movies
        .filter(m => activeGenre === 'Tất cả' || m.genre === activeGenre)
        .filter(m => m.title?.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => sortBy === 'rating' ? (b.rating || 0) - (a.rating || 0)
            : sortBy === 'newest' ? new Date(b.releaseDate) - new Date(a.releaseDate)
                : (b.votes || 0) - (a.votes || 0));

    if (loading) return (
        <div className="loading-screen">
            <div className="loading-inner">
                <div className="loading-spinner" />
                <div className="loading-icon">🎬</div>
                <p className="loading-text">Đang tải lịch chiếu phim...</p>
                <p className="loading-sub">Vui lòng chờ trong giây lát</p>
            </div>
        </div>
    );

    return (
        <div className="db-root">
            {/* HERO */}
            <HeroCarousel movies={movies} onBook={handleBook} />

            {/* STATS */}
            <StatsBar movies={movies} />

            {/* MAIN SECTION */}
            <div className="main-section">
                {/* Section Header */}
                <div className="section-header">
                    <div className="section-title-wrap">
                        <div className="section-accent" />
                        <div>
                            <h2 className="section-title">
                                <Popcorn size={26} className="section-icon" /> Lịch Phim Hot Nhất
                            </h2>
                            <p className="section-sub">Cập nhật mới nhất — {new Date().toLocaleDateString('vi-VN')}</p>
                        </div>
                    </div>

                    {/* Sort */}
                    <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="rating">⭐ Đánh Giá Cao</option>
                        <option value="newest">📅 Mới Nhất</option>
                        <option value="votes">🔥 Nhiều Vote</option>
                    </select>
                </div>

                {/* Search + Genre Filter */}
                <div className="filter-row">
                    <div className="search-wrap">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm phim yêu thích..."
                            className="search-input"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className="search-clear" onClick={() => setSearchTerm('')}><X size={16} /></button>
                        )}
                    </div>
                    <div className="genre-pills">
                        {GENRES.map(g => (
                            <button key={g}
                                className={`genre-pill ${activeGenre === g ? 'genre-pill--active' : ''}`}
                                onClick={() => setActiveGenre(g)}>
                                {GENRE_VI[g] || g}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Count */}
                <div className="result-count">
                    <span className="result-num">{filtered.length}</span> phim được tìm thấy
                    {activeGenre !== 'Tất cả' && <span className="result-filter"> trong thể loại <strong>{GENRE_VI[activeGenre]}</strong></span>}
                </div>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <div className="movie-grid">
                        {filtered.map(movie => <MovieCard key={movie.id} movie={movie} onBook={handleBook} />)}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">🎭</div>
                        <h3 className="empty-title">Không tìm thấy phim</h3>
                        <p className="empty-sub">Thử tìm kiếm với từ khóa khác hoặc chọn thể loại khác</p>
                        <button className="btn-primary" onClick={() => { setSearchTerm(''); setActiveGenre('Tất cả'); }}>
                            Xem tất cả phim
                        </button>
                    </div>
                )}
            </div>

            <Footer />

            <ScheduleModal
                selectedMovie={selectedMovie}
                setSelectedMovie={setSelectedMovie}
                scheduleDate={scheduleDate}
                setScheduleDate={setScheduleDate}
                fetchSchedules={fetchSchedules}
                loadingSchedules={loadingSchedules}
                schedules={schedules}
                fetchSeats={fetchSeats}
            />

            <SeatMapModal
                selectedSchedule={selectedSchedule}
                setSelectedSchedule={setSelectedSchedule}
                preSelectedMovie={preSelectedMovie}
                onBackToShowtimes={onBackToShowtimes}
                loadingSeats={loadingSeats}
                seats={seats}
                selectedSeats={selectedSeats}
                toggleSeat={toggleSeat}
                calculateTotal={calculateTotal}
                handleHoldSeats={handleHoldSeats}
            />
        </div>
    );
};

export default Dashboard;