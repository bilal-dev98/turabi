'use client'
import { ArrowRightIcon, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {
    return (
        <div className='mx-4 sm:mx-6 pt-4 sm:pt-8'>
            {/* Ultra-Luxury Hero Header Section */}
            <div className='relative max-w-4xl mx-auto text-center pt-8 sm:pt-12 pb-6 px-4 space-y-4 sm:space-y-6'>
                {/* Background Ambient Glow */}
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-gradient-to-r from-emerald-400/15 via-amber-400/15 to-teal-400/15 blur-3xl pointer-events-none rounded-full'></div>

                {/* Sparkling Luxury Badge */}
                <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50/90 backdrop-blur-md border border-emerald-200/80 text-emerald-900 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase shadow-xs'>
                    <Sparkles className='w-3.5 h-3.5 text-emerald-600 animate-pulse' />
                    <span>HANDCRAFTED FINE JEWELRY</span>
                    <Sparkles className='w-3.5 h-3.5 text-emerald-600 animate-pulse' />
                </div>

                {/* Elegant Luxury Title */}
                <h1 className='text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] font-serif'>
                    CHAND <span className='bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-700 bg-clip-text text-transparent font-black'>JEWELRY</span>
                </h1>

                {/* Refined Description */}
                <p className='text-slate-600 text-xs sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed font-normal tracking-wide'>
                    Discover timeless handcrafted gold & silver jewelry, luxury rings, necklaces, watches and fine accessories crafted to perfection in Pakistan.
                </p>

                {/* Luxury Action Buttons */}
                <div className='flex items-center justify-center gap-3.5 sm:gap-5 pt-2 relative z-10'>
                    <Link 
                        href="/shop" 
                        className='inline-flex items-center gap-2.5 bg-slate-950 text-white text-xs sm:text-sm font-semibold px-8 sm:px-10 py-3.5 sm:py-4 rounded-[4px] hover:bg-emerald-800 active:scale-95 transition-all shadow-md hover:shadow-lg shadow-emerald-900/10 group tracking-wider uppercase'
                    >
                        <span>Shop Collection</span>
                        <ArrowRightIcon className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                    </Link>

                    <Link 
                        href="/contact" 
                        className='inline-flex items-center gap-2 bg-white text-slate-800 text-xs sm:text-sm font-semibold px-8 sm:px-10 py-3.5 sm:py-4 rounded-[4px] border border-slate-300 hover:border-slate-900 hover:bg-slate-950 hover:text-white active:scale-95 transition-all tracking-wider uppercase shadow-xs'
                    >
                        <span>Contact Us</span>
                    </Link>
                </div>
            </div>

            {/* Single horizontal row layout across all screens */}
            <div className='flex flex-row items-stretch gap-3 sm:gap-4 md:gap-5 max-w-7xl mx-auto my-4 sm:my-8 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2'>
                
                {/* 1. Large Main Hero Banner (~61% width on desktop) */}
                <Link 
                    href="/shop" 
                    className='w-[88vw] sm:w-[58vw] lg:w-auto lg:flex-[3.2] shrink-0 lg:shrink snap-start relative flex flex-col justify-between rounded-[4px] min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] group overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 bg-slate-100'
                >
                    <Image 
                        priority 
                        src="/hero-banners/banner.webp?v=4" 
                        alt="Chand Jewelry Main Banner" 
                        fill
                        sizes="(max-width: 768px) 88vw, 60vw"
                        className='object-cover group-hover:scale-105 transition-transform duration-700 ease-out'
                    />
                </Link>

                {/* 2. Side Card 1 */}
                <Link 
                    href="/shop" 
                    className='w-[55vw] sm:w-[32vw] lg:w-auto lg:flex-1 shrink-0 lg:shrink snap-start relative flex flex-col justify-between rounded-[4px] min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] group overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 bg-slate-100'
                >
                    <Image 
                        src="/hero-banners/card-1.webp" 
                        alt="Chand Jewelry Card 1" 
                        fill
                        sizes="(max-width: 768px) 55vw, 25vw"
                        className='object-cover group-hover:scale-105 transition-transform duration-700 ease-out'
                    />
                </Link>

                {/* 3. Side Card 2 */}
                <Link 
                    href="/shop" 
                    className='w-[55vw] sm:w-[32vw] lg:w-auto lg:flex-1 shrink-0 lg:shrink snap-start relative flex flex-col justify-between rounded-[4px] min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] group overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 bg-slate-100'
                >
                    <Image 
                        src="/hero-banners/card-3.webp" 
                        alt="Chand Jewelry Card 2" 
                        fill
                        sizes="(max-width: 768px) 55vw, 25vw"
                        className='object-cover group-hover:scale-105 transition-transform duration-700 ease-out'
                    />
                </Link>

            </div>
            <CategoriesMarquee />
        </div>
    )
}

export default Hero