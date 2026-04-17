import React, {useState, useEffect} from 'react';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import {Film, UserPlus, LogIn, Menu, X} from 'lucide-react';
import './App.css';

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
    const [currentUser, setCurrentUser] = useState(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const fullName = localStorage.getItem('fullName');
        const role = localStorage.getItem('role');
        if (token && username) return {token, username, fullName, role};
        return null;
    });
    const handleLoginSuccess = (userData) => {
        setCurrentUser(userData);   // Lưu vào state để navbar re-render
        setActivePage('home');      // Chuyển về trang chủ
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
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (window.location.pathname !== '/') {
            window.history.replaceState({}, '', '/');
        }
    }, []);

    const navItems = [
        {key: 'home', label: 'TRANG CHỦ'},
        {key: 'showtimes', label: 'LỊCH CHIẾU'},
        {key: 'cinema', label: 'RẠP CHIẾU'},
        {key: 'register', label: 'ĐĂNG KÝ'},
    ];

    return (
        <div className="app-root">
            {/* ── Navbar ───────────────────────────────── */}
            <nav className={`app-nav ${scrolled ? 'app-nav--scrolled' : ''}`}>
                <div className="nav-inner">
                    {/* Logo */}
                    <div className="nav-logo" onClick={() => setActivePage('home')}>
                        <div className="nav-logo-icon">
                            <Film size={20}/>
                        </div>
                        <span className="nav-logo-text">MOV<span className="nav-logo-accent">IX</span></span>
                    </div>

                    {/* Desktop Links */}
                    <div className="nav-links">
                        {navItems.map(item => (
                            <button
                                key={item.key}
                                className={`nav-link ${activePage === item.key ? 'nav-link--active' : ''}`}
                                onClick={() => setActivePage(item.key)}
                            >
                                {item.label}
                                {activePage === item.key && <span className="nav-link-bar"/>}
                            </button>
                        ))}
                    </div>

                    {/* Auth buttons */}
                    <div className="nav-auth">
                        {currentUser ? (
                            // Đã đăng nhập → hiện tên + nút Đăng Xuất
                            <>
            <span style={{color: 'white', marginRight: '12px', fontWeight: 'bold'}}>
                Xin chào, {currentUser.fullName || currentUser.username}
            </span>
                                <button className="nav-btn-login" onClick={handleLogout}>
                                    Đăng Xuất
                                </button>
                            </>
                        ) : (
                            // Chưa đăng nhập → hiện Đăng Ký + Đăng Nhập
                            <>
                                <button className="nav-btn-login" onClick={() => setActivePage('register')}>
                                    <UserPlus size={16}/> Đăng Ký
                                </button>
                                <button className="nav-btn-primary" onClick={() => setActivePage('login')}>
                                    <LogIn size={16}/> Đăng Nhập
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button className="nav-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="nav-mobile-menu">
                        {navItems.map(item => (
                            <button key={item.key}
                                    className={`nav-mobile-link ${activePage === item.key ? 'nav-mobile-link--active' : ''}`}
                                    onClick={() => {
                                        setActivePage(item.key);
                                        setMobileOpen(false);
                                    }}>
                                {item.label}
                            </button>
                        ))}
                        <div className="nav-mobile-auth">
                            <button className="nav-btn-login" onClick={() => {
                                setActivePage('register');
                                setMobileOpen(false);
                            }}>
                                <UserPlus size={16}/> Đăng Ký
                            </button>
                            <button className="nav-btn-primary" onClick={() => {
                                setActivePage('login');
                                setMobileOpen(false);
                            }}>
                                <LogIn size={16}/> Đăng Nhập
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* ── Page content ─────────────────────────── */}
            <main className="app-main">
                {activePage === 'home' && <Dashboard/>}
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
                {(activePage === 'showtimes' || activePage === 'cinema') && (
                    <div className="coming-soon">
                        <div className="coming-soon-icon">🎬</div>
                        <h2>Tính năng sắp ra mắt</h2>
                        <p>Chúng tôi đang hoàn thiện tính năng này. Hãy quay lại sớm!</p>
                        <button className="btn-primary-app" onClick={() => setActivePage('home')}>
                            ← Về trang chủ
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
