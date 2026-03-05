'use client'
import { StarIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'

const ProductCard = ({ product }) => {

    const currency = useSelector(state => state.settings?.currency) || '$'

    // calculate the average rating of the product
    const rating = Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length);

    return (
        <Link href={`/product/${product.id}`} className=' group max-xl:mx-auto'>
            <div className='bg-[#F5F5F5] h-40  sm:w-60 sm:h-68 rounded-lg flex items-center justify-center'>
                <img
                    className='max-h-30 sm:max-h-40 w-auto group-hover:scale-115 transition duration-300 object-contain'
                    src={product.images[0]}
                    alt={product.name}
                    onError={e => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f5f5f5'/%3E%3Crect x='60' y='70' width='80' height='70' rx='8' fill='%23cccccc'/%3E%3Ccircle cx='100' cy='90' r='18' fill='%23e0e0e0'/%3E%3Cpath d='M70 130 Q100 105 130 130' fill='%23e0e0e0'/%3E%3C/svg%3E"
                    }}
                />
            </div>
            <div className='flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60'>
                <div>
                    <p>{product.name}</p>
                    <div className='flex'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                        ))}
                    </div>
                </div>
                <p>{currency}{product.price}</p>
            </div>
        </Link>
    )
}

export default ProductCard