import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import ShowtimesPage from './pages/ShowtimesPage';
import Header from './components/layout/Header';
import { Film, UserPlus, LogIn, Menu, X } from 'lucide-react';
import './styles/App.css';

const getInitialPage = () => {
    const path = window.location.pathname.toLowerCase();

    if (path === '/login') return 'login';
    if (path === '/register') return 'register';

    return 'home';
};

function App() {
    const [activePage, setActivePage] = useState(getInitialPage);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    
    // Thêm state truyền phim từ trang Lịch chiếu -> Trang chủ chọn ghế
    const [seatMovieContext, setSeatMovieContext] = useState(null);
    const [seatScheduleContext, setSeatScheduleContext] = useState(null);

    const [currentUser, setCurrentUser] = useState(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const fullName = localStorage.getItem('fullName');
        const role = localStorage.getItem('role');
        if (token && username) return { token, username, fullName, role };
        return null;
    });
    const handleLoginSuccess = (userData) => {
        setCurrentUser(userData);
        setActivePage('home');
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('fullName');
        localStorage.removeItem('role');
        setCurrentUser(null);
        setActivePage('home');
    };

    useEffect(() => {
        window.goToLogin = () => setActivePage('login');
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            delete window.goToLogin;
        };
    }, []);

    useEffect(() => {
        if (window.location.pathname !== '/') {
            window.history.replaceState({}, '', '/');
        }
    }, []);

    const navItems = [
        { key: 'home', label: 'TRANG CHỦ' },
        { key: 'showtimes', label: 'LỊCH CHIẾU' },
        { key: 'cinema', label: 'RẠP CHIẾU' },
        { key: 'register', label: 'ĐĂNG KÝ' },
    ];

    return (
        <div className="app-root">
            <Header 
                activePage={activePage}
                setActivePage={setActivePage}
                scrolled={scrolled}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                currentUser={currentUser}
                handleLogout={handleLogout}
                resetSeatContext={() => {
                    setSeatMovieContext(null);
                    setSeatScheduleContext(null);
                }}
            />

            {/* ── Page content ─────────────────────────── */}
            <main className="app-main">
                {activePage === 'home' && (
                    <Dashboard 
                        preSelectedMovie={seatMovieContext} 
                        preSelectedSchedule={seatScheduleContext} 
                        onBackToShowtimes={() => {
                            setSeatMovieContext(null);
                            setSeatScheduleContext(null);
                            setActivePage('showtimes');
                        }}
                    />
                )}
                
                {activePage === 'register' && (
                    <Register
                        onRegisterSuccess={() => setActivePage('login')}
                        goToLogin={() => setActivePage('login')}
                    />
                )}

                {activePage === 'login' && (
                    <Login
                        onLoginSuccess={handleLoginSuccess}
                        goToRegister={() => setActivePage('register')}
                    />
                )}
                
                {activePage === 'showtimes' && (
                    <ShowtimesPage onBookSeat={(movie, sch) => {
                        setSeatMovieContext(movie);
                        setSeatScheduleContext(sch);
                        setActivePage('home');
                    }} />
                )}
                
                {activePage === 'cinema' && (
                    <div className="coming-soon cinema-page">
                        <div className="cinema-header">
                            <h2>Hệ Thống Rạp MOVIX</h2>
                            <p>Trải nghiệm điện ảnh đỉnh cao tại các cụm rạp tiêu chuẩn quốc tế</p>
                        </div>
                        <div className="cinema-grid" style={{display: 'flex', gap: '2rem', padding: '2rem', justifyContent: 'center', flexWrap: 'wrap'}}>
                            {[
                                { id: 1, name: 'MOVIX IMAX Trần Duy Hưng', address: 'Tầng 5, Vincom Plaza, Cầu Giấy, Hà Nội', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80' },
                                { id: 2, name: 'MOVIX Premium Quận 1', address: 'Tầng 6, Saigon Centre, Lê Lợi, Q.1, TP.HCM', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80' },
                                { id: 3, name: 'MOVIX 3D Đà Nẵng', address: 'Vincom Ngô Quyền, Sơn Trà, TP Đà Nẵng', img: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&q=80' }
                            ].map(cinema => (
                                <div key={cinema.id} className="cinema-card" style={{background: '#111', borderRadius: '12px', overflow: 'hidden', width: '320px', border: '1px solid rgba(255,255,255,0.1)'}}>
                                    <img src={cinema.img} alt={cinema.name} style={{width: '100%', height: '180px', objectFit: 'cover'}} />
                                    <div style={{padding: '1.5rem', textAlign: 'left'}}>
                                        <h3 style={{color: '#e50914', marginBottom: '0.5rem', fontSize: '1.2rem'}}>{cinema.name}</h3>
                                        <p style={{color: '#999', fontSize: '0.9rem', lineHeight: '1.4'}}>{cinema.address}</p>
                                        <button className="btn-primary-app" style={{marginTop: '1rem', width: '100%', padding: '0.6rem'}} onClick={() => setActivePage('home')}>
                                            Đến Đặt Vé Rạp Này
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
