'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const LatestProducts = ({ sectionData }) => {

    const displayQuantity = sectionData?.productIds?.length > 0 ? sectionData.productIds.length : 4
    const allProducts = useSelector(state => state.product.list)

    // filter if productIds exist, otherwise default to latest 4
    const products = sectionData?.productIds?.length > 0
        ? sectionData.productIds
            .map(id => allProducts.find(p => p.id === id))
            .filter(Boolean)
        : allProducts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, displayQuantity)

    const title = sectionData?.title || 'Latest Products'

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title title={title} description={`Showing ${products.length} products`} href='/shop' />
            <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between'>
                {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default LatestProducts