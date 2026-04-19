import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Clock } from 'lucide-react';
import api from '../../api/axiosConfig';

const PaymentModal = ({ booking, onClose, onSuccess }) => {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        if (!booking || timeLeft <= 0) return;
        
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        
        return () => clearInterval(timer);
    }, [booking, timeLeft]);

    if (!booking) return null;

    const handleConfirmPayment = async () => {
        setIsConfirming(true);
        try {
            await api.post(`/public/bookings/${booking.id}/confirm-payment`);
            alert('Thanh toán thành công! Vé của bạn đã được xuất.');
            onSuccess();
        } catch (error) {
            console.error(error);
            alert(error.response?.data || 'Có lỗi xảy ra khi xác nhận thanh toán!');
            setIsConfirming(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const qrUrl = `https://img.vietqr.io/image/970422-82222200599999-compact.png?amount=${booking.totalPrice}&addInfo=VePhim${booking.id}&accountName=NGUYEN%20DINH%20GIAP`;

    return (
        <div className="modal-overlay payment-modal-overlay">
            <div className="modal-content payment-modal" onClick={e => e.stopPropagation()}>
                <div className="payment-header" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.8rem', color: '#e50914', marginBottom: '0.5rem' }}>Thanh Toán Vé Xem Phim</h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: timeLeft > 60 ? '#4caf50' : '#f44336', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <Clock size={20} /> Thời gian giữ ghế: {formatTime(timeLeft)}
                    </div>
                    {timeLeft <= 0 && <p style={{ color: '#f44336', marginTop: '0.5rem' }}>Đã hết thời gian giữ ghế. Vui lòng đặt lại!</p>}
                </div>

                <div className="payment-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="qr-container" style={{ background: 'white', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                        <img 
                            src={qrUrl} 
                            alt="VietQR Code" 
                            style={{ width: '250px', height: '250px', objectFit: 'contain' }}
                        />
                    </div>
                    
                    <div className="payment-info" style={{ width: '100%', background: '#222', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#aaa' }}>Mã đơn hàng:</span>
                            <strong>#{booking.id}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#aaa' }}>Người nhận:</span>
                            <strong>NGUYEN DINH GIAP</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#aaa' }}>Ngân hàng:</span>
                            <strong>MB Bank (Hỗ trợ VietQR)</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #444', fontSize: '1.2rem' }}>
                            <span style={{ color: '#fff' }}>Tổng tiền:</span>
                            <strong style={{ color: '#e50914' }}>{booking.totalPrice?.toLocaleString('vi-VN')} VND</strong>
                        </div>
                    </div>

                    <div className="payment-actions" style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                        <button 
                            className="btn-outline" 
                            style={{ flex: 1 }}
                            onClick={onClose}
                        >
                            Hủy Giao Dịch
                        </button>
                        <button 
                            className="btn-primary" 
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            onClick={handleConfirmPayment}
                            disabled={timeLeft <= 0 || isConfirming}
                        >
                            <CheckCircle size={18} /> {isConfirming ? 'Đang Xử Lý...' : 'Xác Nhận Đã Chuyển Khoản'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
