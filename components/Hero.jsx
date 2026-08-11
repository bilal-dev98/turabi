'use client'
import { ArrowRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {
    return (
        <div className='mx-4 sm:mx-6 pt-4 sm:pt-8'>
            {/* Hero Header Section */}
            <div className='max-w-4xl mx-auto text-center pt-4 sm:pt-6 pb-6 px-4 space-y-3.5 sm:space-y-4'>
                <div className='inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] sm:text-xs font-bold border border-emerald-200/80 shadow-2xs'>
                    <span className='w-2 h-2 rounded-full bg-emerald-600 animate-pulse'></span>
                    <span>Handcrafted Luxury & Perfection</span>
                </div>

                <h1 className='text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]'>
                    Welcome to <span className='bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent'>Chand Jewelry</span>
                </h1>

                <p className='text-slate-600 text-xs sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium'>
                    Discover timeless gold & silver jewelry, luxury rings, necklaces, watches and fine accessories handcrafted with perfection in Pakistan.
                </p>

                <div className='flex items-center justify-center gap-3 sm:gap-4 pt-2'>
                    <Link 
                        href="/shop" 
                        className='inline-flex items-center gap-2 bg-slate-900 text-white text-xs sm:text-sm font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-md group'
                    >
                        <span>Shop Collection</span>
                        <ArrowRightIcon className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                    </Link>

                    <Link 
                        href="/contact" 
                        className='inline-flex items-center gap-2 bg-white text-slate-800 text-xs sm:text-sm font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all shadow-xs'
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
                    className='w-[88vw] sm:w-[58vw] lg:w-auto lg:flex-[3.2] shrink-0 lg:shrink snap-start relative flex flex-col justify-between rounded-3xl min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] group overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 bg-slate-100'
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
                    className='w-[55vw] sm:w-[32vw] lg:w-auto lg:flex-1 shrink-0 lg:shrink snap-start relative flex flex-col justify-between rounded-3xl min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] group overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 bg-slate-100'
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
                    className='w-[55vw] sm:w-[32vw] lg:w-auto lg:flex-1 shrink-0 lg:shrink snap-start relative flex flex-col justify-between rounded-3xl min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] group overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 bg-slate-100'
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