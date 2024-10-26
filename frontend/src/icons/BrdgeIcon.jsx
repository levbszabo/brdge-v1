import React from 'react';

const BrdgeIcon = ({ width = 24, height = 24, color = 'currentColor' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main cables */}
        <path d="M2 8C6 3 18 3 22 8" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M2 8C6 13 18 13 22 8" stroke={color} strokeWidth="2" strokeLinecap="round" />

        {/* Towers */}
        <line x1="6" y1="8" x2="6" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="18" y1="8" x2="18" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />

        {/* Deck */}
        <line x1="2" y1="16" x2="22" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />

        {/* Vertical cables */}
        <line x1="9" y1="8" x2="9" y2="16" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <line x1="12" y1="8" x2="12" y2="16" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <line x1="15" y1="8" x2="15" y2="16" stroke={color} strokeWidth="1" strokeLinecap="round" />
    </svg>
);

export default BrdgeIcon;
