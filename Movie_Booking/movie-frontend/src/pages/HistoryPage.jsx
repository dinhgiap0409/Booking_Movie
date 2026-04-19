import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Clock, Calendar, MapPin, Ticket, QrCode, AlertCircle, CheckCircle } from 'lucide-react';
import Footer from '../components/layout/Footer';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const username = localStorage.getItem('username');
            if (!username || username === 'undefined') {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get(`/public/bookings/history?username=${username}`);
                setHistory(res.data);
            } catch (error) {
                console.error("Lỗi lấy lịch sử:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PAID':
                return <span style={{ background: 'rgba(76, 175, 80, 0.2)', color: '#4caf50', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> ĐÃ THANH TOÁN</span>;
            case 'PENDING':
                return <span style={{ background: 'rgba(255, 152, 0, 0.2)', color: '#ff9800', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> CHỜ THANH TOÁN</span>;
            case 'CANCELLED':
                return <span style={{ background: 'rgba(244, 67, 54, 0.2)', color: '#f44336', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} /> ĐÃ HỦY</span>;
            default:
                return <span>{status}</span>;
        }
    };

    if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '5rem' }}>Đang tải lịch sử...</div>;

    if (!localStorage.getItem('username')) {
        return (
            <div style={{ color: 'white', textAlign: 'center', padding: '5rem', minHeight: '100vh', background: '#0a0a0f' }}>
                <h2>Vui lòng đăng nhập để xem lịch sử mua vé</h2>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0', padding: '40px 24px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Ticket size={28} color="#e50914" /> Lịch Sử Mua Vé
                </h2>

                {history.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', background: '#111', borderRadius: '12px' }}>
                        <Ticket size={48} color="#444" style={{ marginBottom: '1rem' }} />
                        <h3>Bạn chưa có giao dịch nào</h3>
                        <p style={{ color: '#888' }}>Hãy đặt vé ngay để trải nghiệm những bộ phim điện ảnh sống động nhất!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {history.map(item => (
                            <div key={item.bookingId} style={{ display: 'flex', background: '#1e1e2a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333', gap: '1rem' }}>
                                {/* Poster (Cột trái) */}
                                <div style={{ width: '140px', flexShrink: 0, padding: '1rem', borderRight: '1px dashed #333', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    {item.moviePoster ? (
                                        <img src={item.moviePoster} alt={item.movieTitle} style={{ width: '100%', borderRadius: '8px', marginBottom: '0.5rem' }} />
                                    ) : (
                                        <div style={{ width: '100px', height: '150px', background: '#333', borderRadius: '8px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Ảnh Phim</div>
                                    )}
                                </div>

                                {/* Thông tin chi tiết (Cột giữa) */}
                                <div style={{ flex: 1, padding: '1.5rem 1rem 1.5rem 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>{item.movieTitle || 'Vé Đặt (Không xác định phim)'}</h3>
                                        <div>{getStatusBadge(item.status)}</div>
                                    </div>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', color: '#94a3b8', fontSize: '14px', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Calendar size={16} /> {item.showDate}</div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Clock size={16} /> {item.showTime?.substring(0, 5)}</div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><MapPin size={16} /> {item.roomName}</div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Ticket size={16} /> Ghế: <strong style={{ color: '#fff' }}>{item.seats}</strong></div>
                                    </div>

                                    <div style={{ borderTop: '1px solid #333', paddingTop: '1rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>Mã Đơn: <strong style={{ color: '#aaa' }}>#{item.bookingId}</strong></div>
                                        <div style={{ fontSize: '1.2rem' }}>Tổng: <strong style={{ color: '#e50914' }}>{item.totalPrice?.toLocaleString('vi-VN')} VND</strong></div>
                                    </div>
                                </div>

                                {/* QR Code (Cột phải) */}
                                {item.status === 'PAID' && item.mainQrCode && (
                                    <div style={{ width: '160px', background: '#fff', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item.mainQrCode}`} alt="QR Code Vé Mua" style={{ width: '120px', height: '120px', marginBottom: '8px' }} />
                                        <span style={{ fontSize: '11px', color: '#333', textAlign: 'center', fontWeight: 'bold' }}>QUÉT MÃ ĐỂ VÀO RẠP</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
