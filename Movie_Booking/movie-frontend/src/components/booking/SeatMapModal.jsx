import React from 'react';
import { X } from 'lucide-react';

const SeatMapModal = ({
    selectedSchedule,
    setSelectedSchedule,
    preSelectedMovie,
    onBackToShowtimes,
    loadingSeats,
    seats,
    selectedSeats,
    toggleSeat,
    calculateTotal,
    handleHoldSeats,
}) => {
    if (!selectedSchedule) return null;

    return (
        <div className="modal-overlay seat-modal-overlay" onClick={() => {
            setSelectedSchedule(null);
            if (preSelectedMovie && onBackToShowtimes) onBackToShowtimes();
        }}>
            <div className="modal-content seat-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={() => {
                    setSelectedSchedule(null);
                    if (preSelectedMovie && onBackToShowtimes) onBackToShowtimes();
                }}><X size={24} /></button>
                
                <div className="seat-header">
                    <h2>Chọn Ghế</h2>
                    <p>{preSelectedMovie?.title} - {selectedSchedule.showDate} {selectedSchedule.showTime?.substring(0, 5)} - {selectedSchedule.room?.name}</p>
                </div>

                {loadingSeats ? (
                    <div className="seat-loading">Đang hiển thị...</div>
                ) : (
                    <div className="seat-map-container">
                        <div className="screen">MÀN HÌNH</div>
                        
                        <div className="seat-grid">
                            {seats.map(seat => {
                                const isSelected = selectedSeats.find(s => s.id === seat.id);
                                const isVIP = seat.seatType === 'VIP';
                                let className = 'seat ';
                                
                                if (seat.status === 'PAID') className += 'seat--paid';
                                else if (seat.status === 'PENDING') className += 'seat--pending';
                                else if (isSelected) className += 'seat--selected';
                                else if (isVIP) className += 'seat--vip';
                                else className += 'seat--available';

                                return (
                                    <div 
                                        key={seat.id} 
                                        className={className} 
                                        onClick={() => toggleSeat(seat)}
                                        title={`${seat.seatName} - ${isVIP ? 'VIP' : 'Thường'}`}
                                    >
                                        {seat.seatName}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="seat-legend">
                            <div className="legend-item"><div className="seat seat--available"></div> Trống</div>
                            <div className="legend-item"><div className="seat seat--vip"></div> VIP</div>
                            <div className="legend-item"><div className="seat seat--selected"></div> Đang Chọn</div>
                            <div className="legend-item"><div className="seat seat--pending"></div> Ghế Chờ</div>
                            <div className="legend-item"><div className="seat seat--paid"></div> Đã Bán</div>
                        </div>
                    </div>
                )}

                <div className="seat-footer">
                    <div className="seat-info">
                        <div>Ghế đang chọn: <strong>{selectedSeats.length ? selectedSeats.map(s => s.seatName).join(', ') : 'Chưa chọn'}</strong></div>
                        <div className="total-price">Tổng tiền: <span>{calculateTotal().toLocaleString('vi-VN')} VND</span></div>
                    </div>
                    <button 
                        className="btn-primary btn-book-seat" 
                        disabled={selectedSeats.length === 0}
                        onClick={handleHoldSeats}
                    >
                        Tiếp Tục Thanh Toán
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatMapModal;
