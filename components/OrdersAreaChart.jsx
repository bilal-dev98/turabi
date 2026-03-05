'use client'
import React from 'react';

export default function OrdersAreaChart() {
    return (
        <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
            <defs>
                <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0df259" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#0df259" stopOpacity="1" />
                    <stop offset="100%" stopColor="#0df259" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="gradientFill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0df259" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0df259" stopOpacity="0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            <path d="M0,250 C100,250 150,150 250,150 C350,150 400,200 500,150 C600,100 700,50 800,20 L800,300 L0,300 Z" fill="url(#gradientFill)" />
            <path d="M0,250 C100,250 150,150 250,150 C350,150 400,200 500,150 C600,100 700,50 800,20" fill="none" stroke="url(#gradientLine)" strokeWidth="4" filter="url(#glow)" />
            <g className="text-xs fill-slate-400 font-medium">
                <text x="10%" y="280">Mon</text>
                <text x="30%" y="280">Tue</text>
                <text x="50%" y="280">Wed</text>
                <text x="70%" y="280">Thu</text>
                <text x="90%" y="280">Fri</text>
            </g>
        </svg>
    )
}
