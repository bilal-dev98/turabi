'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";

const ProductDetails = ({ product }) => {
    const currency = useSelector(state => state.settings?.currency) || '$';
    const cart = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();
    const router = useRouter();

    const [mainImage, setMainImage] = useState(product.images[0]);
    const [zoomed, setZoomed] = useState(false);

    const averageRating = product.rating.reduce((a, i) => a + i.rating, 0) / product.rating.length;
    const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
    const inCart = !!cart[product.id];

    return (
        <div className="flex max-lg:flex-col gap-6 xl:gap-8 items-stretch justify-center">

            {/* ── Left: Image Gallery Card ─────────────────────────── */}
            <div className="flex max-sm:flex-col-reverse gap-3 lg:w-[460px] shrink-0 bg-white rounded-2xl p-4">
                {/* Thumbnails */}
                <div className="flex sm:flex-col gap-2.5 justify-center sm:justify-start">
                    {product.images.map((img, i) => (
                        <button key={i} onClick={() => setMainImage(img)}
                            className={`size-16 sm:size-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${mainImage === img ? "border-primary shadow-md shadow-primary/20" : "border-transparent hover:border-slate-200 bg-slate-50"}`}>
                            <Image src={img} alt="" width={80} height={80} className="object-contain w-full h-full p-1.5" />
                        </button>
                    ))}
                </div>

                {/* Main image */}
                <div
                    onMouseEnter={() => setZoomed(true)}
                    onMouseLeave={() => setZoomed(false)}
                    className="flex-1 relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden flex items-center justify-center min-h-[360px] sm:min-h-[420px] cursor-zoom-in">
                    {discount > 0 && (
                        <div className="absolute top-4 left-4 z-10 bg-primary text-slate-900 text-xs font-black px-3 py-1 rounded-full shadow-lg shadow-primary/30">
                            -{discount}% OFF
                        </div>
                    )}
                    {!product.inStock && (
                        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                            <span className="bg-slate-800 text-white text-sm font-bold px-5 py-2 rounded-full">Out of Stock</span>
                        </div>
                    )}
                    <Image
                        src={mainImage} alt={product.name}
                        width={380} height={380}
                        className={`object-contain max-h-[340px] w-auto transition-transform duration-500 ${zoomed ? "scale-115" : "scale-100"}`}
                    />
                </div>
            </div>

            {/* ── Right: Product Info Card ─────────────────────────── */}
            <div className="flex flex-col gap-5 bg-white rounded-2xl p-6 max-w-xl">
                {/* Category + badges */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        {product.category}
                    </span>
                    {product.inStock ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                            <span className="size-1.5 rounded-full bg-primary inline-block" /> In Stock
                        </span>
                    ) : (
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">Out of Stock</span>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-2xl xl:text-3xl font-bold text-slate-900 leading-tight">{product.name}</h1>

                {/* Rating row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <div className="flex items-center gap-0.5">
                        {Array(5).fill('').map((_, i) => (
                            <svg key={i} viewBox="0 0 24 24" className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-primary' : 'fill-slate-200'}`}>
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{averageRating.toFixed(1)}</span>
                    <span className="text-sm text-slate-400">({product.rating.length} reviews)</span>
                </div>

                {/* Price block */}
                <div className="bg-gradient-to-r from-slate-50 to-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4">
                    <div>
                        <p className="text-3xl font-black text-slate-900">{currency}{product.price}</p>
                        {product.mrp > product.price && (
                            <p className="text-slate-400 line-through text-sm mt-0.5">{currency}{product.mrp}</p>
                        )}
                    </div>
                    {discount > 0 && (
                        <div className="ml-auto text-right">
                            <span className="block text-2xl font-black text-primary">{discount}%</span>
                            <span className="text-xs text-slate-500 font-medium">You save<br />{currency}{(product.mrp - product.price).toFixed(0)}</span>
                        </div>
                    )}
                </div>

                {/* Short desc */}
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{product.description}</p>

                {/* CTA row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                    {inCart && (
                        <div className="flex flex-col gap-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Quantity</p>
                            <Counter productId={product.id} />
                        </div>
                    )}
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => {
                                if (!inCart) {
                                    dispatch(addToCart({ productId: product.id }));
                                }
                                router.push('/cart');
                            }}
                            disabled={!product.inStock}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg ${!product.inStock
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                                : "bg-primary text-slate-900 hover:bg-primary/90 shadow-primary/30"
                                }`}>
                            <span className="material-symbols-outlined text-sm">
                                {!product.inStock ? "block" : "shopping_cart"}
                            </span>
                            {!product.inStock ? "Out of Stock" : "Buy Now"}
                        </button>
                        <button className="p-3.5 rounded-xl border border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-400 hover:bg-red-50 transition-all shrink-0">
                            <span className="material-symbols-outlined text-sm">favorite_border</span>
                        </button>
                        <button className="p-3.5 rounded-xl border border-slate-200 text-slate-500 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all shrink-0">
                            <span className="material-symbols-outlined text-sm">share</span>
                        </button>
                    </div>
                </div>

                {/* Trust signals */}
                <div className="grid grid-cols-3 gap-3 pt-1">
                    {[
                        { icon: "local_shipping", title: "Free Shipping", sub: "Worldwide delivery" },
                        { icon: "verified_user", title: "Secure Payment", sub: "100% protected" },
                        { icon: "autorenew", title: "Easy Returns", sub: "30-day policy" },
                    ].map(({ icon, title, sub }) => (
                        <div key={title} className="flex flex-col items-center text-center gap-1.5 bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
                            <p className="text-xs font-bold text-slate-700">{title}</p>
                            <p className="text-[10px] text-slate-400">{sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProductDetails