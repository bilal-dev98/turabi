'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {
    return (
        <div className='mx-4 sm:mx-6'>
            {/* Single horizontal row layout across all screens with exact un-cropped aspect ratios */}
            <div className='flex flex-row items-center gap-3 sm:gap-4 md:gap-5 max-w-7xl mx-auto my-6 sm:my-10 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2'>
                
                {/* 1. Large Main Hero Banner (Exact 2:1 Aspect Ratio - 0% Cropping) */}
                <Link 
                    href="/shop" 
                    className='w-[85vw] sm:w-[54vw] lg:w-auto lg:flex-[2] shrink-0 lg:shrink snap-start relative aspect-[2/1] rounded-2xl sm:rounded-3xl group overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-500 bg-[#FAF7F2]'
                >
                    <Image 
                        priority 
                        src="/hero-banners/banner.webp" 
                        alt="Chand Jewelry Main Banner" 
                        fill
                        sizes="(max-width: 768px) 85vw, 45vw"
                        className='object-contain group-hover:scale-103 transition-transform duration-700 ease-out'
                    />
                </Link>

                {/* 2. Side Card 1 (Exact 4:5 Aspect Ratio - 0% Cropping) */}
                <Link 
                    href="/shop" 
                    className='w-[50vw] sm:w-[30vw] lg:w-auto lg:flex-1 shrink-0 lg:shrink snap-start relative aspect-[4/5] rounded-2xl sm:rounded-3xl group overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-500 bg-[#FAF7F2]'
                >
                    <Image 
                        src="/hero-banners/card-1.webp" 
                        alt="Chand Jewelry Card 1" 
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className='object-contain group-hover:scale-103 transition-transform duration-700 ease-out'
                    />
                </Link>

                {/* 3. Side Card 2 (Exact 4:5 Aspect Ratio - 0% Cropping) */}
                <Link 
                    href="/shop" 
                    className='w-[50vw] sm:w-[30vw] lg:w-auto lg:flex-1 shrink-0 lg:shrink snap-start relative aspect-[4/5] rounded-2xl sm:rounded-3xl group overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-500 bg-[#FAF7F2]'
                >
                    <Image 
                        src="/hero-banners/card-2.webp" 
                        alt="Chand Jewelry Card 2" 
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className='object-contain group-hover:scale-103 transition-transform duration-700 ease-out'
                    />
                </Link>

                {/* 4. Side Card 3 (Exact 4:5 Aspect Ratio - 0% Cropping) */}
                <Link 
                    href="/shop" 
                    className='w-[50vw] sm:w-[30vw] lg:w-auto lg:flex-1 shrink-0 lg:shrink snap-start relative aspect-[4/5] rounded-2xl sm:rounded-3xl group overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-500 bg-[#FAF7F2]'
                >
                    <Image 
                        src="/hero-banners/card-3.webp" 
                        alt="Chand Jewelry Card 3" 
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className='object-contain group-hover:scale-103 transition-transform duration-700 ease-out'
                    />
                </Link>

            </div>
            <CategoriesMarquee />
        </div>
    )
}

export default Hero