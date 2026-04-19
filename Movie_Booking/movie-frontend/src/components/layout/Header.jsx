import React from 'react';
import { Film, UserPlus, LogIn, Menu, X } from 'lucide-react';

const Header = ({ 
    activePage, 
    setActivePage, 
    scrolled, 
    mobileOpen, 
    setMobileOpen, 
    currentUser, 
    handleLogout, 
    resetSeatContext 
}) => {
    const navItems = [
        { key: 'home', label: 'TRANG CHỦ' },
        { key: 'showtimes', label: 'LỊCH CHIẾU' },
        { key: 'cinema', label: 'RẠP CHIẾU' },
        { key: 'register', label: 'ĐĂNG KÝ' },
    ];

    return (
        <nav className={`app-nav ${scrolled ? 'app-nav--scrolled' : ''}`}>
            <div className="nav-inner">
                {/* Logo */}
                <div className="nav-logo" onClick={() => { if(resetSeatContext) resetSeatContext(); setActivePage('home'); }}>
                    <div className="nav-logo-icon">
                        <Film size={20} />
                    </div>
                    <span className="nav-logo-text">MOV<span className="nav-logo-accent">IX</span></span>
                </div>

                {/* Desktop Links */}
                <div className="nav-links">
                    {navItems.map(item => (
                        <button
                            key={item.key}
                            className={`nav-link ${activePage === item.key ? 'nav-link--active' : ''}`}
                            onClick={() => {
                                if(item.key === 'home' && resetSeatContext) resetSeatContext();
                                setActivePage(item.key);
                            }}
                        >
                            {item.label}
                            {activePage === item.key && <span className="nav-link-bar" />}
                        </button>
                    ))}
                </div>

                {/* Auth buttons */}
                <div className="nav-auth">
                    {currentUser ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '16px' }}>
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${currentUser.fullName || currentUser.username}&background=e50914&color=fff&rounded=true&bold=true`} 
                                    alt="Avatar" 
                                    style={{ width: '32px', height: '32px', border: '1px solid #444', borderRadius: '50%' }}
                                />
                                <span style={{ color: 'white', fontWeight: 'bold' }}>
                                    {currentUser.fullName || currentUser.username}
                                </span>
                            </div>
                            <button className="nav-btn-login" onClick={() => setActivePage('history')} style={{ marginRight: '8px', background: 'transparent', border: '1px solid #444', color: '#fff' }}>
                                Lịch Sử
                            </button>
                            <button className="nav-btn-login" onClick={handleLogout}>
                                Đăng Xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="nav-btn-login" onClick={() => setActivePage('register')}>
                                <UserPlus size={16} /> Đăng Ký
                            </button>
                            <button className="nav-btn-primary" onClick={() => setActivePage('login')}>
                                <LogIn size={16} /> Đăng Nhập
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button className="nav-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="nav-mobile-menu">
                    {navItems.map(item => (
                        <button key={item.key}
                            className={`nav-mobile-link ${activePage === item.key ? 'nav-mobile-link--active' : ''}`}
                            onClick={() => {
                                if(item.key === 'home' && resetSeatContext) resetSeatContext();
                                setActivePage(item.key);
                                setMobileOpen(false);
                            }}>
                            {item.label}
                        </button>
                    ))}
                    <div className="nav-mobile-auth">
                        {currentUser ? (
                            <>
                                <button className="nav-btn-login" onClick={() => {
                                    setActivePage('history');
                                    setMobileOpen(false);
                                }}>
                                    Lịch Sử Mua Vé
                                </button>
                                <button className="nav-btn-primary" onClick={() => {
                                    handleLogout();
                                    setMobileOpen(false);
                                }}>
                                    Đăng Xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="nav-btn-login" onClick={() => {
                                    setActivePage('register');
                                    setMobileOpen(false);
                                }}>
                                    <UserPlus size={16} /> Đăng Ký
                                </button>
                        <button className="nav-btn-primary" onClick={() => {
                            setActivePage('login');
                            setMobileOpen(false);
                        }}>
                            <LogIn size={16} /> Đăng Nhập
                        </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;
