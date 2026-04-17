import React, { useState } from 'react';
import './Login.css';
import api from '../api/axiosConfig';

const Login = ({ onLoginSuccess, goToRegister }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/auth/login', formData);

            const { token, username, role, fullName } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('role', role);
            localStorage.setItem('fullName', fullName);

            alert('Đăng nhập thành công! Xin chào ' + username);

            if (onLoginSuccess) {
                onLoginSuccess({ token, username, role, fullName });
            }
        } catch (error) {
            const errorMsg = error.response?.data || 'Có lỗi xảy ra! Không kết nối được server';
            alert('Lỗi: ' + errorMsg);
        }
    };

    return (
        <div className="login-page">
            <div className="login-page__orb login-page__orb--red" />
            <div className="login-page__orb login-page__orb--purple" />
            <div className="login-page__grid" />

            <div className="login-card">
                <div className="login-brand">
                    <span className="login-brand__icon">🎬</span>
                    <span className="login-brand__name">MOVIX</span>
                </div>

                <div className="login-heading">
                    <h2 className="login-heading__title">Chào mừng trở lại</h2>
                    <p className="login-heading__sub">Đăng nhập để tiếp tục hành trình điện ảnh</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-field">
                        <label className="login-label">Tên đăng nhập</label>
                        <div className="login-input-wrap">
                            <span className="login-input-icon">👤</span>
                            <input
                                name="username"
                                placeholder="Nhập tên đăng nhập"
                                onChange={handleChange}
                                className="login-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="login-field">
                        <label className="login-label">Mật khẩu</label>
                        <div className="login-input-wrap">
                            <span className="login-input-icon">🔒</span>
                            <input
                                name="password"
                                type="password"
                                placeholder="Nhập mật khẩu"
                                onChange={handleChange}
                                className="login-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="login-forgot">
                        <button type="button" className="login-forgot__link">Quên mật khẩu?</button>
                    </div>

                    <button type="submit" className="login-btn">Đăng Nhập</button>
                </form>

                <div className="login-footer-row">
                    Chưa có tài khoản?{' '}
                    <button type="button" className="login-footer-row__link" onClick={goToRegister}>
                        Đăng ký ngay →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
