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
        <div className='px-6 my-20 max-w-6xl mx-auto'>
            <Title visibleButton={false} title={title} description="We offer top-tier service and convenience to ensure your shopping experience is smooth, secure and completely hassle-free." />

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-10 mt-26'>
                {
                    ourSpecsData.map((spec, index) => {
                        return (
                            <div className='relative h-44 px-8 flex flex-col items-center justify-center w-full text-center border rounded-lg group' style={{ backgroundColor: spec.accent + 10, borderColor: spec.accent + 30 }} key={index}>
                                <h3 className='text-slate-800 font-medium'>{spec.title}</h3>
                                <p className='text-sm text-slate-600 mt-3'>{spec.description}</p>
                                <div className='absolute -top-5 text-white size-10 flex items-center justify-center rounded-md group-hover:scale-105 transition' style={{ backgroundColor: spec.accent }}>
                                    <spec.icon size={20} />
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {/* If admin assigned products to this section, show them below the specs */}
            {products.length > 0 && (
                <div className='mt-16 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between'>
                    {products.map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>
            )}

        </div>
    )
}

export default OurSpecs