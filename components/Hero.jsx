'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
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
            <div className='flex max-xl:flex-col gap-6 sm:gap-8 max-w-7xl mx-auto my-6 sm:my-10'>
                <div className='relative flex-1 flex flex-col bg-green-200 rounded-3xl xl:min-h-100 group overflow-hidden'>
                    <div className='p-6 sm:p-16 z-10'>
                        <div className='inline-flex items-center gap-2 sm:gap-3 bg-green-300 text-green-700 pr-3 sm:pr-4 p-1 rounded-full text-[11px] sm:text-sm font-medium'>
                            <span className='bg-green-600 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-white text-[10px] sm:text-xs font-bold'>NEWS</span> Free Shipping on Orders Above $50! <ChevronRightIcon className='group-hover:ml-1 transition-all' size={14} />
                        </div>
                        <h2 className='text-2xl sm:text-5xl leading-[1.2] my-3 sm:my-4 font-semibold text-slate-800 max-w-xs sm:max-w-md tracking-tight'>
                            Gadgets you'll love. Prices you'll trust.
                        </h2>
                        <div className='text-slate-800 text-xs sm:text-sm font-medium mt-3 sm:mt-8'>
                            <p className='text-slate-600'>Starts from</p>
                            <p className='text-2xl sm:text-3xl font-black text-slate-900'>{currency}4.90</p>
                        </div>
                        <button className='bg-slate-900 text-white text-xs sm:text-sm py-3 px-8 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-xl sm:rounded-md hover:bg-slate-800 active:scale-95 transition font-bold tracking-wider'>LEARN MORE</button>
                    </div>
                    <Image priority className='relative sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm max-h-64 sm:max-h-none object-contain ml-auto mt-4 sm:mt-0' src={assets.hero_model_img} alt="" />
                </div>
                <div className='flex flex-col sm:flex-row xl:flex-col gap-4 sm:gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
                    <div className='flex-1 flex items-center justify-between w-full bg-orange-200 rounded-3xl p-6 px-8 group'>
                        <div>
                            <p className='text-2xl sm:text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-40'>Best products</p>
                            <p className='flex items-center gap-1 mt-3 sm:mt-4 text-xs sm:text-sm font-semibold'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={16} /> </p>
                        </div>
                        <Image className='w-28 sm:w-35' src={assets.hero_product_img1} alt="" />
                    </div>
                    <div className='flex-1 flex items-center justify-between w-full bg-emerald-100 rounded-3xl p-6 px-8 group'>
                        <div>
                            <p className='text-2xl sm:text-3xl font-medium bg-gradient-to-r from-slate-800 to-emerald-600 bg-clip-text text-transparent max-w-40'>20% discounts</p>
                            <p className='flex items-center gap-1 mt-3 sm:mt-4 text-xs sm:text-sm font-semibold'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={16} /> </p>
                        </div>
                        <Image className='w-28 sm:w-35' src={assets.hero_product_img2} alt="" />
                    </div>
                </div>
            </div>
            <CategoriesMarquee />
        </div>

    )
}

export default Hero