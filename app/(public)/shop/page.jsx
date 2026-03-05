'use client'
import { Suspense, useState, useMemo, useEffect, useRef, useCallback } from "react"
import ShopProductCard from "@/components/ShopProductCard"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import Image from "next/image"
import Link from "next/link"

// ─── Constants ──────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
    { value: "newest", label: "Newest First" },
    { value: "price_asc", label: "Price: Low → High" },
    { value: "price_dsc", label: "Price: High → Low" },
    { value: "rating", label: "Top Rated" },
    { value: "discount", label: "Biggest Discount" },
]
const PER_PAGE = 12
const PRICE_MAX = 500
const CATEGORY_ICONS = {
    Headphones: "headphones", Speakers: "speaker", Watch: "watch", Earbuds: "earbuds",
    Mouse: "mouse", Decoration: "light", Camera: "photo_camera", Pen: "edit",
    Speakers: "speaker", Theater: "tv", Default: "category"
}

// helper: avg rating
const avgRating = (p) => p.rating?.length
    ? p.rating.reduce((a, c) => a + c.rating, 0) / p.rating.length
    : 0

// ─── Main inner component ────────────────────────────────────────────────────
function ShopContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const allProducts = useSelector(state => state.product.list)

    // ── Filters state ──────────────────────────────────────────────────────
    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [inputVal, setInputVal] = useState(searchParams.get("search") || "")
    const [categories, setCategories] = useState([])           // []  = all
    const [priceRange, setPriceRange] = useState([0, PRICE_MAX])
    const [minRating, setMinRating] = useState(0)
    const [inStockOnly, setInStockOnly] = useState(false)
    const [sort, setSort] = useState("newest")
    const [viewMode, setViewMode] = useState("grid")        // grid | list
    const [page, setPage] = useState(1)
    const [showSugg, setShowSugg] = useState(false)
    const [mobileFOpen, setMobileFOpen] = useState(false)

    const searchRef = useRef(null)

    // unique categories from products
    const allCats = useMemo(() =>
        [...new Set(allProducts.map(p => p.category).filter(Boolean))].sort()
        , [allProducts])

    // ── Search suggestions ─────────────────────────────────────────────────
    const suggestions = useMemo(() => {
        if (!inputVal.trim() || inputVal.length < 2) return []
        const q = inputVal.toLowerCase()
        return allProducts
            .filter(p => p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
            .slice(0, 6)
    }, [inputVal, allProducts])

    // close suggestions on outside click
    useEffect(() => {
        const handler = e => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSugg(false) }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    // ── Filtering + sorting ────────────────────────────────────────────────
    const filtered = useMemo(() => {
        let out = [...allProducts]
        if (search.trim()) out = out.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase()))
        if (categories.length) out = out.filter(p => categories.includes(p.category))
        if (inStockOnly) out = out.filter(p => p.inStock)
        out = out.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
        out = out.filter(p => avgRating(p) >= minRating)
        switch (sort) {
            case "price_asc": out.sort((a, b) => a.price - b.price); break
            case "price_dsc": out.sort((a, b) => b.price - a.price); break
            case "rating": out.sort((a, b) => avgRating(b) - avgRating(a)); break
            case "discount": out.sort((a, b) => (b.mrp - b.price) - (a.mrp - a.price)); break
            default: out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }
        return out
    }, [allProducts, search, categories, priceRange, minRating, inStockOnly, sort])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    // reset page on filter change
    useEffect(() => { setPage(1) }, [search, categories, priceRange, minRating, inStockOnly, sort])

    // active filter chips
    const activeFilters = [
        ...(search ? [{ label: `"${search}"`, clear: () => { setSearch(""); setInputVal("") } }] : []),
        ...categories.map(c => ({ label: c, clear: () => setCategories(prev => prev.filter(x => x !== c)) })),
        ...(inStockOnly ? [{ label: "In Stock", clear: () => setInStockOnly(false) }] : []),
        ...(minRating > 0 ? [{ label: `${minRating}★+`, clear: () => setMinRating(0) }] : []),
        ...(priceRange[0] > 0 || priceRange[1] < PRICE_MAX ? [{ label: `$${priceRange[0]}–$${priceRange[1]}`, clear: () => setPriceRange([0, PRICE_MAX]) }] : []),
    ]

    const clearAll = () => {
        setSearch(""); setInputVal(""); setCategories([]); setPriceRange([0, PRICE_MAX])
        setMinRating(0); setInStockOnly(false); setSort("newest")
    }

    const toggleCategory = (cat) =>
        setCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])

    const handleSuggClick = (product) => {
        setInputVal(product.name); setSearch(product.name); setShowSugg(false)
    }

    const handleSearchSubmit = e => {
        e.preventDefault(); setSearch(inputVal); setShowSugg(false)
    }

    // ── Sidebar Panel ──────────────────────────────────────────────────────
    const SidebarFilters = ({ mobile = false }) => (
        <div className={`space-y-6 ${mobile ? "p-5" : ""}`}>
            {/* Categories */}
            <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">category</span>
                    Categories
                </h3>
                <div className="space-y-1">
                    <button onClick={() => setCategories([])}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${categories.length === 0 ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50"}`}>
                        <span>All Categories</span>
                        <span className="text-xs text-slate-400">{allProducts.length}</span>
                    </button>
                    {allCats.map(cat => {
                        const count = allProducts.filter(p => p.category === cat).length
                        const active = categories.includes(cat)
                        const icon = CATEGORY_ICONS[cat] || CATEGORY_ICONS.Default
                        return (
                            <button key={cat} onClick={() => toggleCategory(cat)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${active ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50"}`}>
                                <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">{icon}</span>
                                    {cat}
                                </span>
                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${active ? "bg-primary/20 text-primary" : "bg-slate-100 text-slate-500"}`}>{count}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Price Range */}
            <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">payments</span>
                    Price Range
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm font-semibold">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">${priceRange[0]}</span>
                        <span className="text-slate-400 text-xs">to</span>
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">${priceRange[1]}</span>
                    </div>
                    {/* Min slider */}
                    <div className="relative">
                        <input type="range" min={0} max={PRICE_MAX} step={5}
                            value={priceRange[0]}
                            onChange={e => { const v = +e.target.value; if (v < priceRange[1]) setPriceRange([v, priceRange[1]]) }}
                            className="w-full accent-primary h-1.5 rounded-full appearance-none bg-slate-200 cursor-pointer" />
                    </div>
                    {/* Max slider */}
                    <div className="relative">
                        <input type="range" min={0} max={PRICE_MAX} step={5}
                            value={priceRange[1]}
                            onChange={e => { const v = +e.target.value; if (v > priceRange[0]) setPriceRange([priceRange[0], v]) }}
                            className="w-full accent-primary h-1.5 rounded-full appearance-none bg-slate-200 cursor-pointer" />
                    </div>
                    {/* Quick presets */}
                    <div className="flex gap-1.5 flex-wrap">
                        {[[0, 50], [50, 100], [100, 200], [200, PRICE_MAX]].map(([lo, hi]) => (
                            <button key={`${lo}-${hi}`} onClick={() => setPriceRange([lo, hi])}
                                className={`text-xs px-2 py-1 rounded-lg border transition-all font-medium ${priceRange[0] === lo && priceRange[1] === hi ? "border-primary bg-primary/10 text-primary" : "border-slate-200 text-slate-500 hover:border-primary/40"}`}>
                                ${lo}–{hi === PRICE_MAX ? `${hi}+` : `$${hi}`}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Minimum Rating */}
            <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">star</span>
                    Minimum Rating
                </h3>
                <div className="space-y-1">
                    {[0, 3, 4, 4.5].map(r => (
                        <button key={r} onClick={() => setMinRating(r)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${minRating === r ? "bg-primary/10 text-primary font-semibold" : "text-slate-600 hover:bg-slate-50"}`}>
                            {r === 0 ? "All Ratings" : (
                                <span className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <svg key={i} viewBox="0 0 24 24" className={`w-3.5 h-3.5 ${i <= r ? "fill-primary" : "fill-slate-200"}`}>
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    ))}
                                    <span className="text-xs ml-0.5">& up</span>
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Availability */}
            <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">inventory</span>
                    Availability
                </h3>
                <button onClick={() => setInStockOnly(v => !v)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${inStockOnly ? "border-primary bg-primary/10 text-primary" : "border-slate-200 text-slate-600 hover:border-primary/30"}`}>
                    <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        In Stock Only
                    </span>
                    <div className={`w-10 h-5 rounded-full transition-all relative ${inStockOnly ? "bg-primary" : "bg-slate-200"}`}>
                        <div className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all ${inStockOnly ? "left-5" : "left-0.5"}`} />
                    </div>
                </button>
            </div>

            {/* Clear all */}
            {activeFilters.length > 0 && (
                <button onClick={clearAll}
                    className="w-full py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all">
                    Clear All Filters
                </button>
            )}
        </div>
    )

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            {/* ── Top Hero Bar ────────────────────────────────────────────── */}
            <div className="bg-white border-b border-slate-100 py-6">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-slate-700 font-medium">Shop</span>
                    </div>

                    {/* Title + search bar */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                                All <span className="text-primary">Products</span>
                            </h1>
                            <p className="text-slate-500 text-sm mt-0.5">{filtered.length} results found</p>
                        </div>

                        {/* Big search bar */}
                        <div ref={searchRef} className="relative w-full max-w-md">
                            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                                <span className="material-symbols-outlined text-slate-400 text-sm shrink-0">search</span>
                                <input
                                    value={inputVal}
                                    onChange={e => { setInputVal(e.target.value); setShowSugg(true) }}
                                    onFocus={() => setShowSugg(true)}
                                    placeholder="Search products, categories…"
                                    className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                                />
                                {inputVal && (
                                    <button type="button" onClick={() => { setInputVal(""); setSearch(""); setShowSugg(false) }}
                                        className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                )}
                                <button type="submit" className="bg-primary text-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shrink-0">
                                    Search
                                </button>
                            </form>

                            {/* Suggestions dropdown */}
                            {showSugg && suggestions.length > 0 && (
                                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                                    <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-between">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Suggestions</p>
                                    </div>
                                    {suggestions.map(p => (
                                        <button key={p.id} onClick={() => handleSuggClick(p)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left">
                                            <div className="size-9 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                                <Image src={p.images[0]} alt="" width={36} height={36} className="object-cover w-full h-full" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                                                <p className="text-xs text-slate-400">{p.category} · ${p.price}</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">View</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Category pills row */}
                    <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
                        <button onClick={() => setCategories([])}
                            className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${categories.length === 0 ? "bg-primary text-slate-900 border-primary" : "border-slate-200 text-slate-600 hover:border-primary/40 bg-white"}`}>
                            All
                        </button>
                        {allCats.map(cat => {
                            const active = categories.includes(cat)
                            const icon = CATEGORY_ICONS[cat] || CATEGORY_ICONS.Default
                            return (
                                <button key={cat} onClick={() => toggleCategory(cat)}
                                    className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${active ? "bg-primary text-slate-900 border-primary shadow-md shadow-primary/20" : "border-slate-200 text-slate-600 hover:border-primary/40 bg-white"}`}>
                                    <span className="material-symbols-outlined text-xs">{icon}</span>
                                    {cat}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* ── Main layout ─────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
                {/* Toolbar: active chips + sort + view toggle */}
                <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Mobile filter button */}
                        <button onClick={() => setMobileFOpen(true)}
                            className="lg:hidden flex items-center gap-2 border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-white transition-all">
                            <span className="material-symbols-outlined text-sm">tune</span>
                            Filters
                            {activeFilters.length > 0 && <span className="bg-primary text-slate-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeFilters.length}</span>}
                        </button>
                        {/* Active filter chips */}
                        {activeFilters.map((f, i) => (
                            <span key={i} className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 bg-white border border-primary/30 text-primary text-xs font-bold rounded-full shadow-sm">
                                {f.label}
                                <button onClick={f.clear} className="size-4 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-[10px]">close</span>
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        {/* Sort */}
                        <select value={sort} onChange={e => setSort(e.target.value)}
                            className="border border-slate-200 bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        {/* Grid / List toggle */}
                        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                            {[["grid_view", "grid"], ["view_list", "list"]].map(([icon, mode]) => (
                                <button key={mode} onClick={() => setViewMode(mode)}
                                    className={`p-2 transition-all ${viewMode === mode ? "bg-primary/10 text-primary" : "text-slate-400 hover:text-slate-600"}`}>
                                    <span className="material-symbols-outlined text-sm">{icon}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* ── Desktop Sidebar ──────────────────────────────────── */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm sticky top-20">
                            <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-primary">tune</span>
                                Filters
                                {activeFilters.length > 0 && (
                                    <span className="ml-auto text-[10px] bg-primary text-slate-900 font-bold px-2 py-0.5 rounded-full">{activeFilters.length}</span>
                                )}
                            </h2>
                            <SidebarFilters />
                        </div>
                    </aside>

                    {/* ── Products Area ─────────────────────────────────────── */}
                    <div className="flex-1 min-w-0">
                        {paginated.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <div className="size-20 rounded-full bg-slate-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-slate-400">search_off</span>
                                </div>
                                <p className="text-lg font-bold text-slate-700">No products found</p>
                                <p className="text-sm text-slate-400 text-center max-w-xs">Try adjusting your filters or search term to find what you're looking for.</p>
                                <button onClick={clearAll} className="mt-2 px-6 py-2.5 bg-primary text-slate-900 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                    Clear All Filters
                                </button>
                            </div>
                        ) : viewMode === "grid" ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                                {paginated.map(product => (
                                    <ShopProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            // List view
                            <div className="space-y-3">
                                {paginated.map(product => {
                                    const rating = avgRating(product)
                                    const disc = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0
                                    return (
                                        <Link key={product.id} href={`/product/${product.id}`}
                                            className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-slate-100 hover:border-primary/20 hover:shadow-md shadow-sm transition-all group">
                                            <div className="size-20 sm:size-24 shrink-0 rounded-xl overflow-hidden bg-[#f5f5f5] flex items-center justify-center">
                                                <Image src={product.images[0]} alt={product.name} width={96} height={96}
                                                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300 max-h-20" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{product.category}</span>
                                                <p className="font-semibold text-slate-900 mt-0.5 truncate">{product.name}</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <svg key={i} viewBox="0 0 24 24" className={`w-3 h-3 ${i <= rating ? "fill-primary" : "fill-slate-200"}`}>
                                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                        </svg>
                                                    ))}
                                                    <span className="text-xs text-slate-400 ml-1">({product.rating?.length || 0})</span>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{product.description}</p>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="text-lg font-bold text-slate-900">${product.price}</p>
                                                {disc > 0 && (
                                                    <>
                                                        <p className="text-xs text-slate-400 line-through">${product.mrp}</p>
                                                        <span className="inline-block text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{disc}% OFF</span>
                                                    </>
                                                )}
                                                {!product.inStock && (
                                                    <span className="block text-[10px] font-bold text-red-500 mt-1">Out of Stock</span>
                                                )}
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}

                        {/* ── Pagination ─────────────────────────────────── */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                                    className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-white hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                    .reduce((acc, p, i, arr) => {
                                        if (i > 0 && p - arr[i - 1] > 1) acc.push("…")
                                        acc.push(p); return acc
                                    }, [])
                                    .map((p, i) => p === "…" ? (
                                        <span key={`e-${i}`} className="px-1 text-slate-400 text-sm">…</span>
                                    ) : (
                                        <button key={p} onClick={() => setPage(p)}
                                            className={`w-9 h-9 rounded-xl text-sm font-bold transition-all border ${p === page ? "bg-primary text-slate-900 border-primary shadow-md shadow-primary/30" : "border-slate-200 text-slate-600 hover:bg-white hover:border-primary/30"}`}>
                                            {p}
                                        </button>
                                    ))}
                                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                                    className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-white hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Mobile Filter Drawer ─────────────────────────────────────── */}
            {mobileFOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileFOpen(false)} />
                    <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-full bg-white shadow-2xl overflow-y-auto lg:hidden animate-slide-in-left">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                            <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-primary">tune</span>
                                Filters
                                {activeFilters.length > 0 && <span className="bg-primary text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">{activeFilters.length}</span>}
                            </h2>
                            <button onClick={() => setMobileFOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                        <SidebarFilters mobile />
                        <div className="p-5 sticky bottom-0 bg-white border-t border-slate-100">
                            <button onClick={() => setMobileFOpen(false)}
                                className="w-full py-3 bg-primary text-slate-900 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                Show {filtered.length} Products
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

// ─── Page wrapper with Suspense ───────────────────────────────────────────────
export default function Shop() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="size-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-400">Loading products…</p>
                </div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    )
}