'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {
    return (
        <div className='mx-4 sm:mx-6'>
            {/* Single horizontal row layout across all screens */}
            <div className='flex flex-row items-stretch gap-3 sm:gap-4 md:gap-5 max-w-7xl mx-auto my-6 sm:my-10 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2'>
                
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