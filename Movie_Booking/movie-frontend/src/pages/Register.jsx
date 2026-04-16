import React, { useState } from 'react';
import api from '../api/axiosConfig';

const Register = () => {
    // formData phải có tên trường khớp y hệt DTO bên Java
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Dữ liệu gửi đi:", formData);
        try {
            const response = await api.post('/auth/register', formData);
            alert("✅ " + response.data);
        } catch (error) {
            console.error("Lỗi chi tiết:", error);
            const errorMsg = error.response?.data || "Có lỗi xảy ra! Không kết nối được server";
            alert("❌ Lỗi: " + errorMsg);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={{ textAlign: 'center' }}>Đăng Ký Tài Khoản</h2>

                <input name="username" placeholder="Tên đăng nhập"
                       onChange={handleChange} style={styles.input} required />

                <input name="email" type="email" placeholder="email"
                       onChange={handleChange} style={styles.input} required />

                <input name="phone" type="Số điện thoại" placeholder="Số Điện Thoại"
                       onChange={handleChange} style={styles.input} required />

                <input name="fullName" placeholder="Họ và tên của bạn"
                       onChange={handleChange} style={styles.input} required />

                <input name="password" type="password" placeholder="Mật Khẩu"
                       onChange={handleChange} style={styles.input} required />

                <button type="submit" style={styles.button}>Đăng Ký Ngay</button>
            </form>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
    form: { display: 'flex', flexDirection: 'column', width: '350px', padding: '30px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
    input: { padding: '12px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '16px' },
    button: { padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }
};

export default Register;