import React from 'react';
import { X } from 'lucide-react';

const ScheduleModal = ({
    selectedMovie,
    setSelectedMovie,
    scheduleDate,
    setScheduleDate,
    fetchSchedules,
    loadingSchedules,
    schedules,
    fetchSeats
}) => {
    if (!selectedMovie) return null;

    return (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
            <div className="modal-content schedule-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedMovie(null)}><X size={24} /></button>
                
                <div className="modal-header">
                    <h2 className="modal-title">Lịch Chiếu: {selectedMovie.title}</h2>
                    <p className="modal-sub">Vui lòng chọn ngày và suất chiếu phù hợp</p>
                </div>
                
                <div className="modal-body">
                    <div className="schedule-filter">
                        <label>Chọn ngày:</label>
                        <input 
                            type="date" 
                            className="date-input" 
                            value={scheduleDate} 
                            onChange={(e) => {
                                setScheduleDate(e.target.value);
                                fetchSchedules(selectedMovie.id, e.target.value);
                            }} 
                        />
                        {scheduleDate && (
                            <button className="btn-clear-date" onClick={() => {
                                setScheduleDate('');
                                fetchSchedules(selectedMovie.id, '');
                            }}>Tất cả các ngày</button>
                        )}
                    </div>

                    {loadingSchedules ? (
                        <div className="schedule-loading">Đang tải lịch chiếu...</div>
                    ) : schedules.length > 0 ? (
                        <div className="schedule-list">
                            {Object.entries(
                                schedules.reduce((acc, sch) => {
                                    (acc[sch.showDate] = acc[sch.showDate] || []).push(sch);
                                    return acc;
                                }, {})
                            ).map(([date, schs]) => (
                                <div key={date} className="schedule-group">
                                    <h4 className="schedule-date">{date}</h4>
                                    <div className="time-slots">
                                        {schs.map(sch => (
                                            <button key={sch.id} className="time-slot" onClick={() => fetchSeats(sch)}>
                                                <span className="time">{sch.showTime?.substring(0, 5)}</span>
                                                <span className="room-type">{sch.room?.name || 'Phòng chiếu'}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="schedule-empty">
                            <p>Không có lịch chiếu nào cho {scheduleDate ? 'ngày này' : 'phim này'}.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScheduleModal;
