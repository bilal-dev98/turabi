'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useSelector } from 'react-redux'

const ShopProductCard = ({ product }) => {
    const currency = useSelector(state => state.settings?.currency) || '$'

    const rating = product.rating?.length
        ? Math.round(product.rating.reduce((a, c) => a + c.rating, 0) / product.rating.length)
        : 0

    const discount = product.mrp && product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0

    return (
        <Link href={`/product/${product.id}`}
            className="group flex flex-col w-full bg-white rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 overflow-hidden transition-all duration-300">
            {/* Image area */}
            <div className="relative bg-[#F5F5F5] w-full aspect-square flex items-center justify-center overflow-hidden">
                <Image
                    width={300} height={300}
                    className="object-contain w-3/4 h-3/4 group-hover:scale-110 transition-transform duration-300"
                    src={product.images[0]} alt={product.name}
                />
                {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-primary text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                        -{discount}%
                    </span>
                )}
                {!product.inStock && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-full">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col gap-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{product.category}</p>
                <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                </p>
                <div className="flex items-center gap-1">
                    {Array(5).fill('').map((_, i) => (
                        <svg key={i} viewBox="0 0 24 24" className={`w-3 h-3 ${i < rating ? 'fill-primary' : 'fill-slate-200'}`}>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    ))}
                    <span className="text-[10px] text-slate-400 ml-0.5">({product.rating?.length || 0})</span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-base font-black text-slate-900">{currency}{product.price}</span>
                    {discount > 0 && (
                        <span className="text-xs text-slate-400 line-through">{currency}{product.mrp}</span>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default ShopProductCard
