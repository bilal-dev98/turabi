'use client'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const BestSelling = ({ sectionData }) => {

    const displayQuantity = sectionData?.productIds?.length > 0 ? sectionData.productIds.length : 8
    const allProducts = useSelector(state => state.product.list)

    // filter if productIds exist, otherwise default to bestselling based on ratings count
    const products = sectionData?.productIds?.length > 0
        ? sectionData.productIds
            .map(id => allProducts.find(p => p.id === id))
            .filter(Boolean)
        : allProducts.slice().sort((a, b) => b.rating.length - a.rating.length).slice(0, displayQuantity)

    const title = sectionData?.title || 'Best Selling'

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title title={title} description={`Showing ${products.length} products`} href='/shop' />
            <div className='mt-12  grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12'>
                {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default BestSelling