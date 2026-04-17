import React from 'react';
import { Film } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="db-footer">
            <div className="footer-inner">
                <div className="footer-logo">
                    <Film size={22} />
                    <span>MOVIX</span>
                </div>
                <p className="footer-tagline">Trải nghiệm điện ảnh đỉnh cao tại Việt Nam 🎬</p>
                <p className="footer-copy">© 2026 MOVIX Cinema System • All rights reserved</p>
            </div>
        </footer>
    );
};

export default Footer;
