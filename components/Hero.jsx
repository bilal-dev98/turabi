'use client'
import { ArrowRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {
    return (
        <div className='mx-4 sm:mx-6 pt-4 sm:pt-8'>
            {/* Ultra-Modern Minimal Luxury Header */}
            <div className='max-w-3xl mx-auto text-center pt-6 sm:pt-10 pb-6 px-4 space-y-4 sm:space-y-5'>
                {/* Minimalist Sub-heading / Eyebrow */}
                <div className='flex items-center justify-center gap-3 text-emerald-800/80 text-[10px] sm:text-xs tracking-[0.25em] font-semibold uppercase'>
                    <span className='h-[1px] w-8 bg-emerald-600/30'></span>
                    <span>Fine & High Jewelry</span>
                    <span className='h-[1px] w-8 bg-emerald-600/30'></span>
                </div>

                {/* Minimal Luxury Title */}
                <h1 className='text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-slate-900 leading-[1.08] font-serif'>
                    Chand <span className='font-black bg-gradient-to-r from-emerald-800 via-emerald-600 to-teal-700 bg-clip-text text-transparent'>Jewelry</span>
                </h1>

                {/* Refined Description */}
                <p className='text-slate-600 text-xs sm:text-base max-w-xl mx-auto leading-relaxed font-normal tracking-wide'>
                    Discover timeless handcrafted gold & silver jewelry, luxury rings, necklaces, watches and fine accessories crafted to perfection.
                </p>

                {/* Luxury Action Buttons */}
                <div className='flex items-center justify-center gap-3 sm:gap-4 pt-1'>
                    <Link 
                        href="/shop" 
                        className='inline-flex items-center gap-2.5 bg-slate-950 text-white text-xs sm:text-sm font-semibold px-7 sm:px-9 py-3 sm:py-3.5 rounded-full hover:bg-emerald-800 active:scale-95 transition-all shadow-sm hover:shadow-md group tracking-wide'
                    >
                        <span>Shop Collection</span>
                        <ArrowRightIcon className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                    </Link>

                    <Link 
                        href="/contact" 
                        className='inline-flex items-center gap-2 bg-transparent text-slate-800 text-xs sm:text-sm font-semibold px-7 sm:px-9 py-3 sm:py-3.5 rounded-full border border-slate-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white active:scale-95 transition-all tracking-wide'
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