'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {

    const currencyRaw = useSelector(state => state.settings?.currency)
    const [currency, setCurrency] = useState('Rs')

    useEffect(() => {
        if (currencyRaw) setCurrency(currencyRaw)
    }, [currencyRaw])

    return (
        <div className='mx-4 sm:mx-6'>
            {/* Single horizontal row layout across all screens */}
            <div className='flex flex-row items-stretch gap-3 sm:gap-4 md:gap-5 max-w-7xl mx-auto my-6 sm:my-10 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2'>
                
                {/* 1. Large Main Hero Banner (Significantly larger ~45% width on desktop) */}
                <Link 
                    href="/shop" 
                    className='w-[85vw] sm:w-[54vw] lg:w-auto lg:flex-[2.4] shrink-0 lg:shrink snap-start relative flex flex-col justify-between bg-gradient-to-br from-green-200 via-emerald-100 to-teal-200 rounded-3xl min-h-[380px] sm:min-h-[420px] group overflow-hidden p-6 sm:p-10 border border-green-300/40 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300'
                >
                    <div className='z-10 relative space-y-3 sm:space-y-4'>
                        <div className='inline-flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-md text-green-800 pr-3 sm:pr-4 p-1 rounded-full text-[11px] sm:text-xs font-semibold shadow-xs'>
                            <span className='bg-emerald-600 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-white text-[10px] sm:text-xs font-bold'>NEWS</span> 
                            Free Shipping Above Rs 2500! 
                            <ChevronRightIcon className='group-hover:translate-x-1 transition-transform' size={14} />
                        </div>
                        <h2 className='text-2xl sm:text-4xl lg:text-4xl leading-[1.2] font-extrabold text-slate-800 tracking-tight max-w-xs sm:max-w-md'>
                            Exquisite Jewelry. Prices You'll Trust.
                        </h2>
                        <div className='text-slate-800 text-xs sm:text-sm font-medium pt-1'>
                            <p className='text-slate-600 font-semibold'>Starts from</p>
                            <p className='text-2xl sm:text-3xl font-black text-slate-900'>{currency}490</p>
                        </div>
                        <div>
                            <span className='inline-block bg-slate-900 text-white text-xs sm:text-sm py-3 px-6 sm:py-3.5 sm:px-8 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all font-bold tracking-wider shadow-md'>
                                LEARN MORE
                            </span>
                        </div>
                    </div>
                    <Image 
                        priority 
                        className='absolute bottom-0 right-0 sm:right-2 w-48 sm:w-64 lg:w-72 max-h-56 sm:max-h-72 object-contain group-hover:scale-105 transition-transform duration-500 pointer-events-none' 
                        src={assets.hero_model_img} 
                        alt="Hero Model" 
                    />
                </Link>

                {/* 2. Compact Side Card 1 (Best Products) */}
                <Link 
                    href="/shop" 
                    className='w-[55vw] sm:w-[32vw] lg:w-auto lg:flex-1 shrink-0 lg:shrink snap-start relative flex flex-col justify-between bg-gradient-to-b from-orange-100 to-amber-200 rounded-3xl min-h-[380px] sm:min-h-[420px] p-5 sm:p-6 group overflow-hidden border border-orange-200/60 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300'
                >
                    <div className='z-10 space-y-1'>
                        <span className='inline-block bg-orange-500/20 text-orange-800 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full'>
                            TOP RATED
                        </span>
                        <p className='text-base sm:text-lg font-bold text-slate-900 leading-snug truncate'>Best Products</p>
                        <p className='text-[11px] text-slate-600 font-medium truncate'>Handcrafted & Trending</p>
                    </div>
                    <div className='relative z-10 my-2 flex justify-center'>
                        <Image className='w-24 sm:w-28 h-24 sm:h-28 object-contain group-hover:scale-110 transition-transform duration-500' src={assets.hero_product_img1} alt="Best Products" />
                    </div>
                    <div className='z-10 flex items-center justify-between pt-1 text-[11px] font-bold text-slate-900 group-hover:text-orange-700 transition-colors'>
                        <span>View more</span>
                        <ArrowRightIcon className='group-hover:translate-x-1 transition-transform' size={14} />
                    </div>
                </Link>

                {/* 3. Compact Side Card 2 (20% Discounts) */}
                <Link 
                    href="/shop" 
                    className='w-[55vw] sm:w-[32vw] lg:w-auto lg:flex-1 shrink-0 lg:shrink snap-start relative flex flex-col justify-between bg-gradient-to-b from-emerald-100 to-teal-200 rounded-3xl min-h-[380px] sm:min-h-[420px] p-5 sm:p-6 group overflow-hidden border border-emerald-200/60 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300'
                >
                    <div className='z-10 space-y-1'>
                        <span className='inline-block bg-emerald-600/20 text-emerald-900 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full'>
                            OFFER
                        </span>
                        <p className='text-base sm:text-lg font-bold text-slate-900 leading-snug truncate'>20% Discounts</p>
                        <p className='text-[11px] text-slate-600 font-medium truncate'>Limited Time Offers</p>
                    </div>
                    <div className='relative z-10 my-2 flex justify-center'>
                        <Image className='w-24 sm:w-28 h-24 sm:h-28 object-contain group-hover:scale-110 transition-transform duration-500' src={assets.hero_product_img2} alt="Discounts" />
                    </div>
                    <div className='z-10 flex items-center justify-between pt-1 text-[11px] font-bold text-slate-900 group-hover:text-emerald-800 transition-colors'>
                        <span>View deals</span>
                        <ArrowRightIcon className='group-hover:translate-x-1 transition-transform' size={14} />
                    </div>
                </Link>

                {/* 4. Compact Side Card 3 (New Arrivals) */}
                <Link 
                    href="/shop" 
                    className='w-[55vw] sm:w-[32vw] lg:w-auto lg:flex-1 shrink-0 lg:shrink snap-start relative flex flex-col justify-between bg-gradient-to-b from-purple-100 to-indigo-200 rounded-3xl min-h-[380px] sm:min-h-[420px] p-5 sm:p-6 group overflow-hidden border border-indigo-200/60 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300'
                >
                    <div className='z-10 space-y-1'>
                        <span className='inline-block bg-indigo-600/20 text-indigo-900 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full'>
                            JUST IN
                        </span>
                        <p className='text-base sm:text-lg font-bold text-slate-900 leading-snug truncate'>New Arrivals</p>
                        <p className='text-[11px] text-slate-600 font-medium truncate'>Latest Collection</p>
                    </div>
                    <div className='relative z-10 my-2 flex justify-center'>
                        <Image className='w-24 sm:w-28 h-24 sm:h-28 object-contain group-hover:scale-110 transition-transform duration-500' src={assets.product_img3} alt="New Arrivals" />
                    </div>
                    <div className='z-10 flex items-center justify-between pt-1 text-[11px] font-bold text-slate-900 group-hover:text-indigo-800 transition-colors'>
                        <span>Explore now</span>
                        <ArrowRightIcon className='group-hover:translate-x-1 transition-transform' size={14} />
                    </div>
                </Link>

            </div>
            <CategoriesMarquee />
        </div>
    )
}

export default Hero