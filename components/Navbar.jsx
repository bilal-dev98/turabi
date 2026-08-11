'use client'
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProduct } from "@/lib/features/product/productSlice";

const Navbar = () => {

    const router = useRouter();
    const dispatch = useDispatch();

    const [search, setSearch] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    
    const searchRef = useRef(null)
    const mobileSearchRef = useRef(null)

    const cartCount = useSelector(state => state.cart?.total) || 0
    const products = useSelector(state => state.product?.list) || []
    const currency = useSelector(state => state.settings?.currency) || 'Rs'

    // Fetch products if not loaded in Redux store yet
    useEffect(() => {
        if (products.length === 0) {
            fetch('/api/products')
                .then(res => res.json())
                .then(data => {
                    if (data?.success && Array.isArray(data.data)) {
                        dispatch(setProduct(data.data))
                    }
                })
                .catch(err => console.error("Error loading products in Navbar:", err))
        }
    }, [products.length, dispatch])

    // Filter matching products for live search dropdown
    const searchResults = useMemo(() => {
        if (!search.trim()) return []
        const query = search.toLowerCase().trim()
        return products.filter(p =>
            p.name?.toLowerCase().includes(query) ||
            p.category?.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query)
        ).slice(0, 6)
    }, [search, products])

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                searchRef.current && !searchRef.current.contains(e.target) &&
                mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)
            ) {
                setIsSearchOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSearch = (e) => {
        e?.preventDefault()
        if (search.trim()) {
            router.push(`/shop?search=${encodeURIComponent(search.trim())}`)
            setIsSearchOpen(false)
            setMobileMenuOpen(false)
        }
    }

    const handleSelectProduct = (productId) => {
        router.push(`/product/${productId}`)
        setIsSearchOpen(false)
        setMobileMenuOpen(false)
        setSearch('')
    }

    return (
        <nav className="relative bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="mx-4 sm:mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-3 sm:py-4 transition-all">

                    {/* Chand Jewelry logo */}
                    <Link href="/" className="shrink-0 flex items-center" style={{ height: '40px', textDecoration: 'none' }}>
                        <img
                            src="/turabi-logo.png"
                            alt="Chand Jewelry Logo"
                            className="h-10 sm:h-12 w-auto object-contain block"
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600 font-medium text-sm">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                        <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                        <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>

                        {/* Search Input Container with Dropdown */}
                        <div ref={searchRef} className="relative hidden xl:block w-xs">
                            <form onSubmit={handleSearch} className="flex items-center w-full text-sm gap-2 bg-slate-100 px-4 py-2.5 rounded-full border border-transparent focus-within:border-slate-300">
                                <Search size={16} className="text-slate-500 shrink-0" />
                                <input 
                                    className="w-full bg-transparent outline-none placeholder-slate-500" 
                                    type="text" 
                                    placeholder="Search products" 
                                    value={search} 
                                    onChange={(e) => { setSearch(e.target.value); setIsSearchOpen(true); }}
                                    onFocus={() => setIsSearchOpen(true)}
                                    onClick={() => setIsSearchOpen(true)}
                                />
                                {search && (
                                    <button 
                                        type="button" 
                                        onClick={() => { setSearch(''); setIsSearchOpen(false); }} 
                                        className="text-slate-400 hover:text-slate-600 shrink-0"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </form>

                            {/* Dropdown overlay */}
                            {isSearchOpen && search.trim().length > 0 && (
                                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[9999] overflow-hidden py-1 max-h-[380px] overflow-y-auto">
                                    {searchResults.length > 0 ? (
                                        <>
                                            <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Products ({searchResults.length})</span>
                                            </div>
                                            {searchResults.map(p => (
                                                <div 
                                                    key={p.id} 
                                                    onClick={() => handleSelectProduct(p.id)}
                                                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                                                >
                                                    <div className="size-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                                                        {p.images?.[0] ? (
                                                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-1" />
                                                        ) : (
                                                            <Search size={16} className="text-slate-300" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                                                        <p className="text-[10px] text-slate-400 capitalize">{p.category}</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <span className="text-xs font-bold text-slate-900">{currency}{p.price}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
                                                <button
                                                    onClick={handleSearch}
                                                    className="text-xs font-bold text-primary hover:underline"
                                                >
                                                    View all results for "{search}"
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-4 text-center text-xs text-slate-400">
                                            No products found for "{search}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                            <ShoppingCart size={18} />
                            Cart
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 text-[10px] text-slate-900 bg-primary font-bold size-4 flex items-center justify-center rounded-full shadow-sm">{cartCount}</span>
                            )}
                        </Link>

                        <Link
                            href="/track-order"
                            className="px-6 py-2 bg-primary hover:bg-primary/90 transition text-slate-900 rounded-full font-bold shadow-md shadow-primary/20 hover:shadow-lg text-sm"
                        >
                            Track Order
                        </Link>
                    </div>

                    {/* Mobile Navigation Icons */}
                    <div className="flex sm:hidden items-center gap-3">
                        <Link href="/cart" className="relative p-2 text-slate-700">
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 text-[10px] text-slate-900 bg-primary font-bold size-4 flex items-center justify-center rounded-full shadow-sm">{cartCount}</span>
                            )}
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden fixed inset-x-0 top-[57px] bg-white border-b border-slate-200 shadow-xl z-50 p-5 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
                    <div ref={mobileSearchRef} className="relative">
                        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-slate-100 px-4 py-3 rounded-xl">
                            <Search size={18} className="text-slate-500 shrink-0" />
                            <input 
                                className="w-full bg-transparent outline-none text-sm placeholder-slate-500" 
                                type="text" 
                                placeholder="Search products..." 
                                value={search} 
                                onChange={(e) => { setSearch(e.target.value); setIsSearchOpen(true); }}
                                onFocus={() => setIsSearchOpen(true)}
                                onClick={() => setIsSearchOpen(true)}
                            />
                            {search && (
                                <button type="button" onClick={() => setSearch('')} className="text-slate-400 p-1">
                                    <X size={16} />
                                </button>
                            )}
                            <button type="submit" className="text-xs font-bold bg-primary text-slate-900 px-3 py-1.5 rounded-lg shrink-0">Search</button>
                        </form>

                        {/* Mobile Dropdown */}
                        {isSearchOpen && search.trim().length > 0 && (
                            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-[9999] overflow-hidden py-1 max-h-[300px] overflow-y-auto">
                                {searchResults.length > 0 ? (
                                    <>
                                        {searchResults.map(p => (
                                            <div 
                                                key={p.id} 
                                                onClick={() => handleSelectProduct(p.id)}
                                                className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                                            >
                                                <div className="size-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                                                    {p.images?.[0] ? (
                                                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-1" />
                                                    ) : (
                                                        <Search size={16} className="text-slate-300" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                                                    <p className="text-[10px] text-slate-400 capitalize">{p.category}</p>
                                                </div>
                                                <span className="text-xs font-bold text-slate-900">{currency}{p.price}</span>
                                            </div>
                                        ))}
                                        <div className="p-2 bg-slate-50 text-center border-t border-slate-100">
                                            <button onClick={handleSearch} className="text-xs font-bold text-primary">
                                                View all results
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-3 text-center text-xs text-slate-400">
                                        No products found for "{search}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 text-slate-700 font-medium">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between">
                            Home <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
                        </Link>
                        <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between">
                            Shop <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
                        </Link>
                        <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between">
                            About Us <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
                        </Link>
                        <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between">
                            Contact Us <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
                        </Link>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                        <Link
                            href="/track-order"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full py-3 bg-primary hover:bg-primary/90 transition text-slate-900 text-center rounded-xl font-bold text-sm shadow-md shadow-primary/20"
                        >
                            Track Order
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar