'use client'
import React from 'react'
import Title from './Title'
import { ourSpecsData } from '@/assets/assets'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const OurSpecs = ({ sectionData }) => {

    const allProducts = useSelector(state => state.product?.list || [])

    const products = sectionData?.productIds?.length > 0
        ? sectionData.productIds
            .map(id => allProducts.find(p => p.id === id))
            .filter(Boolean)
        : []

    const title = sectionData?.title || 'Our Specifications'

    return (
        <div className='px-4 sm:px-6 my-12 sm:my-20 max-w-6xl mx-auto'>
            <Title visibleButton={false} title={title} description="We offer top-tier service and convenience to ensure your shopping experience is smooth, secure and completely hassle-free." />

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 gap-y-8 sm:gap-y-10 mt-12 sm:mt-20'>
                {
                    ourSpecsData.map((spec, index) => {
                        return (
                            <div className='relative h-40 sm:h-44 px-6 sm:px-8 flex flex-col items-center justify-center w-full text-center border rounded-2xl group' style={{ backgroundColor: spec.accent + 10, borderColor: spec.accent + 30 }} key={index}>
                                <h3 className='text-slate-800 font-semibold text-base sm:text-lg'>{spec.title}</h3>
                                <p className='text-xs sm:text-sm text-slate-600 mt-2 sm:mt-3 leading-relaxed'>{spec.description}</p>
                                <div className='absolute -top-5 text-white size-10 flex items-center justify-center rounded-xl group-hover:scale-105 transition shadow-sm' style={{ backgroundColor: spec.accent }}>
                                    <spec.icon size={20} />
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {/* If admin assigned products to this section, show them below the specs */}
            {products.length > 0 && (
                <div className='mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5'>
                    {products.map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>
            )}

        </div>
    )
}

export default OurSpecs