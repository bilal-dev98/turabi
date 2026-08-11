'use client'
import React from 'react'

const OurSpecs = ({ sectionData }) => {
    return (
        <section className="w-full bg-[#f6f6f7] py-[80px] px-[20px] flex justify-center font-sans my-10 sm:my-16">
            <div className="w-full max-w-[1100px] text-center">
                {/* Header Block */}
                <div className="mb-12">
                    <span 
                        className="inline-block text-[0.75rem] font-semibold uppercase tracking-[1px] mb-4 bg-gradient-to-r from-[#F5C344] via-[#F28482] to-[#B567C2] bg-clip-text text-transparent"
                    >
                        Chand Jewelry Craftsmanship
                    </span>
                    <h2 className="text-[2.25rem] sm:text-[2.75rem] font-medium text-[#0f172a] tracking-[-0.02em] leading-tight mb-3">
                        Built for Luxury & Elegance
                    </h2>
                    <p className="text-[1.125rem] text-[#64748b] leading-[1.5]">
                        Everything you need to experience timeless jewelry<br />from selection to delivery
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] text-left">
                    
                    {/* Card 1 — Handcrafted Custom Designs */}
                    <div 
                        className="relative h-[390px] rounded-[20px] overflow-hidden flex flex-col justify-end shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]"
                        style={{
                            background: 'radial-gradient(circle at 50% 0%, #FFB347 0%, #F9ED96 30%, #F4F8F9 60%, #F4F8F9 100%)'
                        }}
                    >
                        <div className="absolute inset-x-0 top-0 bottom-[105px] flex items-center justify-center px-[24px]">
                            <img 
                                src="/icons/Handcrafted%20Custom%20Designs.webp" 
                                alt="Handcrafted Custom Designs" 
                                className="w-full h-[210px] object-contain mt-[15px] drop-shadow-md"
                            />
                        </div>

                        <div className="p-[24px] pb-[28px] z-10">
                            <h3 className="text-[1.1rem] font-semibold text-[#1e293b]">
                                Handcrafted Custom Designs
                            </h3>
                            <p className="text-[0.825rem] text-[#64748b] mt-2.5 font-normal leading-relaxed">
                                Bespoke gold & silver jewelry tailored to perfection by master artisans.
                            </p>
                        </div>
                    </div>

                    {/* Card 2 — Insured Express Shipping */}
                    <div 
                        className="relative h-[390px] rounded-[20px] overflow-hidden flex flex-col justify-end shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]"
                        style={{
                            background: 'radial-gradient(circle at 50% 0%, #E5A1F5 0%, #F8ACA0 30%, #F4F8F9 60%, #F4F8F9 100%)'
                        }}
                    >
                        <div className="absolute inset-x-0 top-0 bottom-[105px] flex items-center justify-center px-[24px]">
                            <img 
                                src="/icons/Insured%20Express%20Shipping.webp" 
                                alt="Insured Express Shipping" 
                                className="w-full h-[200px] object-contain mt-[10px] drop-shadow-md"
                            />
                        </div>

                        <div className="p-[24px] pb-[28px] z-10">
                            <h3 className="text-[1.1rem] font-semibold text-[#1e293b]">
                                Insured Express Shipping
                            </h3>
                            <p className="text-[0.825rem] text-[#64748b] mt-2.5 font-normal leading-relaxed">
                                Fast, safe & fully insured doorstep delivery across Pakistan & worldwide.
                            </p>
                        </div>
                    </div>

                    {/* Card 3 — 100% Certified Guarantee */}
                    <div 
                        className="relative h-[390px] rounded-[20px] overflow-hidden flex flex-col justify-end shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]"
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
                            alt="Luxury Catalog Icon" 
                            className="absolute top-[45px] left-1/2 -translate-x-1/2 w-[175px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.08)]"
                        />

                        {/* Search Pill */}
                        <div className="absolute top-[220px] left-1/2 -translate-x-1/2 bg-white border border-black px-[18px] py-[6px] rounded-[20px] text-[0.75rem] font-medium text-[#1e293b] shadow-[0_8px_20px_rgba(0,0,0,0.06)] whitespace-nowrap flex items-center gap-[8px]">
                            <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <span>Search in Luxury Catalog</span>
                        </div>

                        <div className="p-[24px] pb-[28px] z-10">
                            <h3 className="text-[1.1rem] font-semibold text-[#1e293b]">
                                100% Certified Guarantee
                            </h3>
                            <p className="text-[0.825rem] text-[#64748b] mt-2.5 font-normal leading-relaxed">
                                Genuine hallmarked precious metals, certified stones & lifetime warranty.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default OurSpecs