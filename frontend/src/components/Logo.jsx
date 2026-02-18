import React from 'react';

const Logo = ({ className = "h-8 w-8 text-electric-600" }) => (
    <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4" className="opacity-20" />
        <path
            d="M50 15L30 55H45L40 85L70 45H55L60 15H50Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
        />
        <path
            d="M35 50L65 50"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            className="opacity-40"
        />
        <defs>
            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" />
                <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
        </defs>
    </svg>
);

export default Logo;
