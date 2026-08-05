'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import { getColorHex } from "@/lib/colors";

const ProductDetails = ({ product }) => {
    const currency = useSelector(state => state.settings?.currency) || 'Rs';
    const cart = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();
    const router = useRouter();

    const [mainImage, setMainImage] = useState(product.images[0]);
    const [zoomed, setZoomed] = useState(false);

    const [selectedColor, setSelectedColor] = useState(product.colors && product.colors.length > 0 ? product.colors[0] : null);

    const averageRating = product.rating?.length ? product.rating.reduce((a, i) => a + i.rating, 0) / product.rating.length : 0;
    const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

    // Check if the current selected variation is in the cart
    const cartItemId = selectedColor ? `${product.id}-${selectedColor}` : product.id;
    const inCart = !!cart[cartItemId];

    return (
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-stretch justify-center">

            {/* ── Left: Image Gallery Card ─────────────────────────── */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 lg:w-[460px] shrink-0 bg-white rounded-2xl p-4 border border-slate-100">
                {/* Thumbnails */}
                <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible no-scrollbar pb-1 sm:pb-0 shrink-0">
                    {product.images.map((img, i) => (
                        <button key={i} onClick={() => setMainImage(img)}
                            className={`size-14 sm:size-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${mainImage === img ? "border-primary shadow-md shadow-primary/20" : "border-transparent hover:border-slate-200 bg-slate-50"}`}>
                            <Image src={img} alt="" width={80} height={80} className="object-contain w-full h-full p-1" />
                        </button>
                    ))}
                </div>

                {/* Main image */}
                <div
                    onMouseEnter={() => setZoomed(true)}
                    onMouseLeave={() => setZoomed(false)}
                    className="flex-1 relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden flex items-center justify-center min-h-[280px] sm:min-h-[420px] cursor-zoom-in">
                    {discount > 0 && (
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 bg-primary text-slate-900 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full shadow-lg shadow-primary/30">
                            -{discount}% OFF
                        </div>
                    )}
                    {!product.inStock && (
                        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                            <span className="bg-slate-800 text-white text-xs sm:text-sm font-bold px-4 py-1.5 sm:px-5 sm:py-2 rounded-full">Out of Stock</span>
                        </div>
                    )}
                    <Image
                        src={mainImage} alt={product.name}
                        width={380} height={380}
                        className={`object-contain max-h-[250px] sm:max-h-[340px] w-auto transition-transform duration-500 ${zoomed ? "scale-115" : "scale-100"}`}
                    />
                </div>
            </div>

            {/* ── Right: Product Info Card ─────────────────────────── */}
            <div className="flex flex-col gap-4 sm:gap-5 bg-white rounded-2xl p-4 sm:p-6 max-w-xl border border-slate-100">
                {/* Category + badges */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        {product.category}
                    </span>
                    {product.inStock ? (
                        <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                            <span className="size-1.5 rounded-full bg-primary inline-block" /> In Stock
                        </span>
                    ) : (
                        <span className="text-[10px] sm:text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">Out of Stock</span>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl xl:text-3xl font-bold text-slate-900 leading-tight">{product.name}</h1>

                {/* Rating row */}
                <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1">
                    <div className="flex items-center gap-0.5">
                        {Array(5).fill('').map((_, i) => (
                            <svg key={i} viewBox="0 0 24 24" className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < Math.round(averageRating) ? 'fill-primary' : 'fill-slate-200'}`}>
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">{averageRating.toFixed(1)}</span>
                    <span className="text-xs sm:text-sm text-slate-400">({product.rating.length} reviews)</span>
                </div>

                {/* Price block */}
                <div className="bg-gradient-to-r from-slate-50 to-white border border-slate-100 rounded-2xl p-3.5 sm:p-4 flex items-center gap-4">
                    <div>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900">{currency}{product.price}</p>
                        {product.mrp > product.price && (
                            <p className="text-slate-400 line-through text-xs sm:text-sm mt-0.5">{currency}{product.mrp}</p>
                        )}
                    </div>
                    {discount > 0 && (
                        <div className="ml-auto text-right">
                            <span className="block text-xl sm:text-2xl font-black text-primary">{discount}%</span>
                            <span className="text-[10px] sm:text-xs text-slate-500 font-medium">You save<br />{currency}{(product.mrp - product.price).toFixed(0)}</span>
                        </div>
                    )}
                </div>

                {/* Short desc */}
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">{product.description}</p>

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                    <div className="flex flex-col gap-2 sm:gap-3">
                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Color</p>
                        <div className="flex flex-wrap gap-2.5 sm:gap-3">
                            {product.colors.map(colorName => {
                                const hex = getColorHex(colorName);
                                const isSelected = selectedColor === colorName;
                                return (
                                    <button
                                        key={colorName}
                                        onClick={() => setSelectedColor(colorName)}
                                        title={colorName}
                                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all flex items-center justify-center ${isSelected ? 'ring-2 ring-offset-2 ring-primary scale-110 shadow-md shadow-primary/30' : 'ring-1 ring-slate-200 hover:scale-105 shadow-sm'}`}
                                        style={{ backgroundColor: hex }}
                                    >
                                        {isSelected && (
                                            <span className="material-symbols-outlined text-white text-xs sm:text-base" style={{ textShadow: '0 0 3px rgba(0,0,0,0.5)' }}>check</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* CTA row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                    {inCart && (
                        <div className="flex flex-col gap-1">
                            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Quantity</p>
                            <Counter productId={product.id} color={selectedColor} />
                        </div>
                    )}
                    <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => {
                                if (!inCart) {
                                    dispatch(addToCart({ productId: product.id, color: selectedColor }));
                                }
                                router.push('/cart');
                            }}
                            disabled={!product.inStock || (product.colors?.length > 0 && !selectedColor)}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-lg ${(!product.inStock || (product.colors?.length > 0 && !selectedColor))
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                                : "bg-primary text-slate-900 hover:bg-primary/90 shadow-primary/30"
                                }`}>
                            <span className="material-symbols-outlined text-sm">
                                {!product.inStock ? "block" : "shopping_cart"}
                            </span>
                            {!product.inStock ? "Out of Stock" : (product.colors?.length > 0 && !selectedColor) ? "Select Color" : "Buy Now"}
                        </button>
                    </div>
                </div>

                {/* Trust signals */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
                    {[
                        { icon: "local_shipping", title: "Free Shipping", sub: "Worldwide delivery" },
                        { icon: "verified_user", title: "Secure Payment", sub: "100% protected" },
                        { icon: "autorenew", title: "Easy Returns", sub: "30-day policy" },
                    ].map(({ icon, title, sub }) => (
                        <div key={title} className="flex flex-col items-center text-center gap-1 bg-slate-50 rounded-xl p-2 sm:p-3 border border-slate-100">
                            <span className="material-symbols-outlined text-primary text-lg sm:text-xl">{icon}</span>
                            <p className="text-[10px] sm:text-xs font-bold text-slate-700 leading-tight">{title}</p>
                            <p className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:block">{sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProductDetails