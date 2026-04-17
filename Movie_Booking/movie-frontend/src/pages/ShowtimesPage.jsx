import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

const ShowtimesPage = ({ onBookSeat }) => {
    const [movies, setMovies] = useState([]);
    const [schedulesMap, setSchedulesMap] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy 4 phim hot nhất
                const resMovies = await api.get('/public/movies');
                const topMovies = resMovies.data.slice(0, 4);
                setMovies(topMovies);

                const map = {};
                for (let m of topMovies) {
                    try {
                        const schRes = await api.get('/public/schedules/movie/' + m.id);
                        // Chỉ lấy schedule của ngày hiện tại (hoặc tương lai gần)
                        map[m.id] = (schRes.data || []).slice(0, 5); // Hiển thị 5 suất mỗi phim
                    } catch (e) { map[m.id] = []; }
                }
                setSchedulesMap(map);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div style={{textAlign:'center', padding:'5rem', color:'white'}}>Đang tải lịch chiếu...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', color: 'white', padding: '2rem 1rem' }}>
            <h2 style={{fontSize: '2rem', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom:'1rem'}}>Lịch Chiếu Phim Nổi Bật Hôm Nay</h2>
            {movies.map(movie => {
                const schs = schedulesMap[movie.id] || [];
                if (schs.length === 0) return null;
                
                return (
                    <div key={movie.id} style={{ display: 'flex', gap: '2rem', background: '#111', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #222' }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.5rem', color: '#e50914', marginBottom: '0.5rem' }}>{movie.title}</h3>
                            <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                                <span><Clock size={14} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> {movie.duration} phút</span>
                            </div>
                            
                            <h4 style={{fontSize:'1rem', marginBottom:'10px', color:'#fff'}}>Suất chiếu: </h4>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {schs.map(sch => (
                                    <button 
                                        key={sch.id} 
                                        style={{ background: '#333', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s', fontWeight:'bold' }}
                                        onClick={() => {
                                            const token = localStorage.getItem('token');
                                            if (!token || token === 'undefined' || token === 'null') {
                                                alert('⚠️ Vui lòng ĐĂNG NHẬP để có thể xem và đặt ghế!');
                                                if (window.goToLogin) window.goToLogin();
                                                return;
                                            }
                                            if (onBookSeat) onBookSeat(movie, sch);
                                            else alert('Sẽ chuyển sang hệ thống chọn ghế của phim ' + movie.title);
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#e50914'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#333'}
                                    >
                                        {sch.showTime?.substring(0, 5)} - {sch.room?.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ShowtimesPage;
