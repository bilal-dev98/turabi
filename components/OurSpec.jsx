'use client'
import React from 'react'

const OurSpecs = ({ sectionData }) => {
    return (
        <section className="w-full bg-white py-[80px] px-[20px] flex justify-center font-sans">
            <div className="w-full max-w-[1100px] text-center">
                {/* Header Block */}
                <div className="mb-12">
                    <span 
                        className="inline-block text-[0.75rem] font-semibold uppercase tracking-[1px] mb-4 bg-gradient-to-r from-[#F5C344] via-[#F28482] to-[#B567C2] bg-clip-text text-transparent"
                    >
                        Core Features
                    </span>
                    <h2 className="text-[2.25rem] sm:text-[2.75rem] font-medium text-[#0f172a] tracking-[-0.02em] leading-tight mb-3">
                        Built for Speed & Quality
                    </h2>
                    <p className="text-[1.125rem] text-[#64748b] leading-[1.5]">
                        Everything you need to go<br />from idea to image
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] text-left">
                    
                    {/* Card 1 — Smart Prompt Suggestions */}
                    <div 
                        className="relative h-[340px] rounded-[20px] overflow-hidden flex flex-col justify-end shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]"
                        style={{
                            background: 'radial-gradient(circle at 50% 0%, #FFB347 0%, #F9ED96 30%, #F4F8F9 60%, #F4F8F9 100%)'
                        }}
                    >
                        {/* Prompt Box */}
                        <div className="absolute top-[30px] left-[24px] right-[24px] bg-white rounded-[12px] p-4 text-[0.8rem] text-[#475569] leading-[1.6] shadow-[0_8px_20px_rgba(0,0,0,0.04)]">
                            A bright, high-resolution 3D illustration of a{' '}
                            <span className="font-semibold bg-gradient-to-r from-[#FFB347] to-[#E5A1F5] bg-clip-text text-transparent">
                                cheerful cartoon
                            </span>{' '}
                            of a{' '}
                            <span className="font-semibold bg-gradient-to-r from-[#FFB347] to-[#E5A1F5] bg-clip-text text-transparent">
                                girl character
                            </span>{' '}
                            <span className="font-semibold bg-gradient-to-r from-[#FFB347] to-[#E5A1F5] bg-clip-text text-transparent">
                                centred against a
                            </span>{' '}
                            smooth blue background
                        </div>

                        {/* Add More Details Pill */}
                        <div className="absolute top-[180px] left-[40px] bg-white border border-black px-[14px] py-[5px] rounded-[20px] text-[0.75rem] font-semibold text-[#1e293b] shadow-[0_4px_15px_rgba(0,0,0,0.08)] flex items-center gap-[6px]">
                            <span className="text-[#a855f7] text-[1rem]">✦</span>
                            <span>Add more details</span>
                        </div>

                        {/* Cursor Arrow */}
                        <svg 
                            className="absolute top-[205px] left-[110px] w-6 h-6 z-10 drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)]"
                            viewBox="0 0 24 24" 
                            fill="#0f172a" 
                            stroke="#ffffff" 
                            strokeWidth="1"
                        >
                            <path d="M4 2L20 11L11 13L9 22L4 2Z" />
                        </svg>

                        <h3 className="text-[1.05rem] font-semibold text-[#1e293b] p-[24px] z-10">
                            Smart Prompt Suggestions
                        </h3>
                    </div>

                    {/* Card 2 — API Access */}
                    <div 
                        className="relative h-[340px] rounded-[20px] overflow-hidden flex flex-col justify-end shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]"
                        style={{
                            background: 'radial-gradient(circle at 50% 0%, #E5A1F5 0%, #F8ACA0 30%, #F4F8F9 60%, #F4F8F9 100%)'
                        }}
                    >
                        <div className="absolute inset-x-0 top-0 bottom-[70px] flex items-center justify-center px-[24px]">
                            <img 
                                src="https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/network.svg" 
                                alt="API Network" 
                                className="w-full h-[180px] object-contain mt-[20px]"
                            />
                        </div>

                        <h3 className="text-[1.05rem] font-semibold text-[#1e293b] p-[24px] z-10">
                            API Access
                        </h3>
                    </div>

                    {/* Card 3 — Project Library */}
                    <div 
                        className="relative h-[340px] rounded-[20px] overflow-hidden flex flex-col justify-end shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]"
                        style={{
                            background: 'radial-gradient(circle at 50% 0%, #F9ED96 0%, #E5A1F5 30%, #F4F8F9 60%, #F4F8F9 100%)'
                        }}
                    >
                        {/* Mesh Overlay */}
                        <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
                                backgroundSize: '16px 16px',
                                WebkitMaskImage: 'radial-gradient(circle at center top, black 0%, transparent 80%)',
                                maskImage: 'radial-gradient(circle at center top, black 0%, transparent 80%)'
                            }}
                        />

                        {/* Folder Image */}
                        <img 
                            src="https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/library%20icon.svg" 
                            alt="Folder Library Icon" 
                            className="absolute top-[50px] left-1/2 -translate-x-1/2 w-[170px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.08)]"
                        />

                        {/* Search Pill */}
                        <div className="absolute top-[220px] left-1/2 -translate-x-1/2 bg-white border border-black px-[18px] py-[6px] rounded-[20px] text-[0.75rem] font-medium text-[#1e293b] shadow-[0_8px_20px_rgba(0,0,0,0.06)] whitespace-nowrap flex items-center gap-[8px]">
                            <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <span>Search in library</span>
                        </div>

                        <h3 className="text-[1.05rem] font-semibold text-[#1e293b] p-[24px] z-10">
                            Project Library
                        </h3>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default OurSpecs