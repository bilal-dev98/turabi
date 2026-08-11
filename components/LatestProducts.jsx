'use client'
import React, { useState } from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const LatestProducts = ({ sectionData }) => {
    const [visibleCount, setVisibleCount] = useState(8)
    const allProducts = useSelector(state => state.product.list)

    // filter if productIds exist, otherwise default to latest sorted products
    const sortedProducts = sectionData?.productIds?.length > 0
        ? sectionData.productIds
            .map(id => allProducts.find(p => p.id === id))
            .filter(Boolean)
        : allProducts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    const products = sortedProducts.slice(0, visibleCount)
    const title = sectionData?.title || 'Latest Products'

    return (
        <div className='px-4 sm:px-6 my-10 sm:my-16 max-w-6xl mx-auto'>
            <Title title={title} description={`Showing ${products.length} of ${sortedProducts.length} products`} href='/shop' />
            <div className='mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5'>
                {products.map((product, index) => (
                    <ProductCard key={product.id || index} product={product} />
                ))}
            </div>

            {visibleCount < sortedProducts.length && (
                <div className='mt-10 text-center'>
                    <button
                        onClick={() => setVisibleCount(prev => prev + 4)}
                        className='inline-flex items-center gap-2 px-8 py-3 bg-slate-950 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-[4px] shadow-sm hover:shadow-md transition-all active:scale-95 tracking-wider uppercase'
                    >
                        <span>Load More</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    )
}

export default LatestProducts