import React from 'react';
import { X } from 'lucide-react';
import '../../styles/Dashboard.css';

const TrailerModal = ({ movie, onClose }) => {
    if (!movie) return null;

    // Use a high-quality trailer, e.g., Marvel or Generic Trailer
    const defaultTrailer = 'https://www.youtube.com/embed/TcMBFSGVi1c';
    const trailerUrl = movie.trailerUrl || defaultTrailer;

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
            <div 
                className="trailer-modal-content" 
                onClick={e => e.stopPropagation()} 
                style={{
                    position: 'relative',
                    width: '90%',
                    maxWidth: '1000px',
                    aspectRatio: '16/9',
                    background: '#000',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                    overflow: 'hidden'
                }}
            >
                <button 
                    className="modal-close" 
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(0,0,0,0.6)',
                        border: 'none',
                        color: 'white',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                    }}
                >
                    <X size={24} />
                </button>
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={`${trailerUrl}?autoplay=1`} 
                    title={`${movie.title} Trailer`} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    style={{ border: 'none' }}
                ></iframe>
            </div>
        </div>
    );
};

export default TrailerModal;
