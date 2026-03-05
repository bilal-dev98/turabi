'use client'
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

const ProductDescription = ({ product }) => {
    const [selectedTab, setSelectedTab] = useState('Description')

    const ratings = product.rating || []
    const avgRating = ratings.length > 0 ? ratings.reduce((a, i) => a + i.rating, 0) / ratings.length : 0

    // Rating distribution
    const dist = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: ratings.filter(r => Math.round(r.rating) === star).length,
        pct: ratings.length > 0 ? Math.round((ratings.filter(r => Math.round(r.rating) === star).length / ratings.length) * 100) : 0
    }))

    return (
        <div className="mt-8 sm:mt-14 mb-20">
            {/* ── Tab bar ─────────────────────────────────────────── */}
            <div className="flex gap-1 border-b border-slate-100 mb-8 justify-center">
                {['Description', 'Reviews'].map(tab => (
                    <button key={tab} onClick={() => setSelectedTab(tab)}
                        className={`relative px-6 py-3 text-sm font-semibold transition-colors ${tab === selectedTab
                            ? "text-slate-900"
                            : "text-slate-400 hover:text-slate-600"
                            }`}>
                        {tab}
                        {tab === 'Reviews' && (
                            <span className={`ml-2 text-[10px] font-black px-1.5 py-0.5 rounded-full ${tab === selectedTab ? "bg-primary text-slate-900" : "bg-slate-100 text-slate-500"}`}>
                                {ratings.length}
                            </span>
                        )}
                        {tab === selectedTab && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* ── Description ─────────────────────────────────────── */}
            {selectedTab === "Description" && (
                <div className="max-w-3xl mx-auto space-y-6">
                    <p className="text-slate-600 leading-8 text-[15px]">{product.description}</p>

                    {/* Feature highlights */}
                    <div className="grid sm:grid-cols-2 gap-3 mt-6">
                        {[
                            { icon: "verified", label: "Quality Guaranteed", sub: "Tested and certified" },
                            { icon: "local_shipping", label: "Fast Delivery", sub: "Ships within 24 hours" },
                            { icon: "replay_30", label: "30-Day Returns", sub: "No questions asked" },
                            { icon: "support_agent", label: "24/7 Support", sub: "Always here to help" },
                        ].map(({ icon, label, sub }) => (
                            <div key={label} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <span className="material-symbols-outlined text-primary text-xl shrink-0">{icon}</span>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Reviews ─────────────────────────────────────────── */}
            {selectedTab === "Reviews" && (
                <div className="max-w-3xl mx-auto">
                    {/* Summary card */}
                    <div className="flex gap-8 bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-6 mb-8">
                        <div className="text-center shrink-0">
                            <p className="text-6xl font-black text-slate-900">{avgRating.toFixed(1)}</p>
                            <div className="flex justify-center gap-0.5 my-2">
                                {Array(5).fill('').map((_, i) => (
                                    <svg key={i} viewBox="0 0 24 24" className={`w-4 h-4 ${i < Math.round(avgRating) ? 'fill-primary' : 'fill-slate-200'}`}>
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-xs text-slate-400">{ratings.length} reviews</p>
                        </div>
                        <div className="flex-1 space-y-2">
                            {dist.map(({ star, count, pct }) => (
                                <div key={star} className="flex items-center gap-2.5">
                                    <span className="text-xs font-bold text-slate-500 w-3">{star}</span>
                                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-primary shrink-0">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="text-xs text-slate-400 w-4">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Individual review cards */}
                    <div className="space-y-4">
                        {ratings.length === 0 && (
                            <p className="text-center text-slate-500 py-10 border border-slate-100 border-dashed rounded-xl">No reviews yet.</p>
                        )}
                        {ratings.map((item, i) => {
                            const name = item.isCustom ? item.reviewerName : (item.user?.name || "Anonymous");
                            const image = item.isCustom ? item.reviewerImage : item.user?.image;

                            return (
                                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-primary/20 hover:shadow-sm transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="size-11 rounded-full object-cover shrink-0 ring-2 ring-slate-100 bg-slate-100 flex items-center justify-center overflow-hidden">
                                            {image ? (
                                                <Image src={image} alt={name} width={44} height={44} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-slate-400">person</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                                <p className="font-bold text-slate-800 text-sm">{name}</p>
                                                <p className="text-[11px] text-slate-400">{new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                            </div>
                                            <div className="flex items-center gap-0.5 mt-1">
                                                {Array(5).fill('').map((_, j) => (
                                                    <svg key={j} viewBox="0 0 24 24" className={`w-3.5 h-3.5 ${j < Math.round(item.rating) ? 'fill-primary' : 'fill-slate-200'}`}>
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                    </svg>
                                                ))}
                                                <span className="text-[11px] text-slate-400 ml-1.5">{item.rating.toFixed(1)}</span>
                                            </div>
                                            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{item.review}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDescription