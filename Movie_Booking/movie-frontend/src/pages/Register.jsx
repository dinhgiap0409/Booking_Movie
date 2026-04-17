import React, { useState } from 'react';
import '../styles/Register.css';
import api from '../api/axiosConfig';

const Register = ({ onRegisterSuccess, goToLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: '',
        phone: ''
    });

    const [errors, setErrors] = useState({});

    const BLOCKED_USERNAMES = ['admin', 'root', 'support', 'administrator', 'system', 'superuser', 'moderator', 'mod'];

    const validate = (data) => {
        const newErrors = {};

        if (!data.username) {
            newErrors.username = 'Tên đăng nhập không được để trống';
        } else if (!/^[a-zA-Z][a-zA-Z0-9_]{5,19}$/.test(data.username)) {
            newErrors.username = 'Bắt đầu bằng chữ cái, dài 6-20 ký tự, chỉ chứa chữ/số/dấu_';
        } else if (BLOCKED_USERNAMES.includes(data.username.toLowerCase())) {
            newErrors.username = 'Tên đăng nhập này không được phép sử dụng';
        }

        if (!data.email) {
            newErrors.email = 'Email không được để trống';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)) {
            newErrors.email = 'Email không đúng định dạng';
        }

        if (!data.phone) {
            newErrors.phone = 'Số điện thoại không được để trống';
        } else if (!/^(0)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/.test(data.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ (số di động Việt Nam 10 số)';
        }

        const trimmedName = data.fullName.trim().replace(/\s+/g, ' ');
        if (!trimmedName) {
            newErrors.fullName = 'Họ tên không được để trống';
        } else if (!/^[\p{L}]+(?:[\s'-][\p{L}]+)+$/u.test(trimmedName)) {
            newErrors.fullName = 'Họ tên phải có ít nhất 2 từ, không chứa số hay ký tự đặc biệt';
        }

        if (!data.password) {
            newErrors.password = 'Mật khẩu không được để trống';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(data.password)) {
            newErrors.password = 'Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)';
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const newData = { ...formData, [e.target.name]: e.target.value };
        setFormData(newData);
        const fieldErrors = validate(newData);
        setErrors(prev => ({
            ...prev,
            [e.target.name]: fieldErrors[e.target.name] || ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedData = {
            ...formData,
            fullName: formData.fullName.trim().replace(/\s+/g, ' ')
        };

        const validationErrors = validate(trimmedData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await api.post('/auth/register', trimmedData);
            alert(response.data + '\nVui lòng đăng nhập để tiếp tục!');
            if (onRegisterSuccess) onRegisterSuccess();
        } catch (error) {
            const errorMsg = error.response?.data || 'Có lỗi xảy ra! Không kết nối được server';
            alert('Lỗi: ' + errorMsg);
        }
    };

    return (
        <div className="register-page">
            <div className="register-page__orb register-page__orb--red" />
            <div className="register-page__orb register-page__orb--purple" />
            <div className="register-page__grid" />

            <div className="register-card">
                <div className="register-brand">
                    <span className="register-brand__icon">🎬</span>
                    <span className="register-brand__name">MOVIX</span>
                </div>

                <div className="register-heading">
                    <h2 className="register-heading__title">Tạo tài khoản mới</h2>
                    <p className="register-heading__sub">Tham gia cộng đồng điện ảnh MOVIX</p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="register-field">
                        <label className="register-label">Họ và tên</label>
                        <div className="register-input-wrap">
                            <span className="register-input-icon">✨</span>
                            <input
                                name="fullName"
                                placeholder="Nguyễn Văn A"
                                onChange={handleChange}
                                className={`register-input ${errors.fullName ? 'register-input--error' : ''}`}
                            />
                        </div>
                        {errors.fullName && <span className="register-error-msg">{errors.fullName}</span>}
                    </div>

                    <div className="register-field">
                        <label className="register-label">Email</label>
                        <div className="register-input-wrap">
                            <span className="register-input-icon">📧</span>
                            <input
                                name="email"
                                type="text"
                                placeholder="email@example.com"
                                onChange={handleChange}
                                className={`register-input ${errors.email ? 'register-input--error' : ''}`}
                            />
                        </div>
                        {errors.email && <span className="register-error-msg">{errors.email}</span>}
                    </div>

                    <div className="register-field">
                        <label className="register-label">Số điện thoại</label>
                        <div className="register-input-wrap">
                            <span className="register-input-icon">📱</span>
                            <input
                                name="phone"
                                placeholder="0901234567"
                                onChange={handleChange}
                                className={`register-input ${errors.phone ? 'register-input--error' : ''}`}
                            />
                        </div>
                        {errors.phone && <span className="register-error-msg">{errors.phone}</span>}
                    </div>

                    <div className="register-field">
                        <label className="register-label">Tên đăng nhập</label>
                        <div className="register-input-wrap">
                            <span className="register-input-icon">👤</span>
                            <input
                                name="username"
                                placeholder="myusername"
                                onChange={handleChange}
                                className={`register-input ${errors.username ? 'register-input--error' : ''}`}
                            />
                        </div>
                        {errors.username && <span className="register-error-msg">{errors.username}</span>}
                    </div>

                    <div className="register-field">
                        <label className="register-label">Mật khẩu</label>
                        <div className="register-input-wrap">
                            <span className="register-input-icon">🔒</span>
                            <input
                                name="password"
                                type="password"
                                placeholder="Tối thiểu 8 ký tự"
                                onChange={handleChange}
                                className={`register-input ${errors.password ? 'register-input--error' : ''}`}
                            />
                        </div>
                        {errors.password && <span className="register-error-msg">{errors.password}</span>}
                    </div>

                    <button type="submit" className="register-btn">Đăng Ký Ngay 🚀</button>
                </form>

                <div className="register-footer-row" style={{ marginTop: '20px' }}>
                    Đã có tài khoản?{' '}
                    <button type="button" className="register-footer-row__link" onClick={goToLogin}>
                        Đăng nhập ngay →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
