'use client'
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {

    const router = useRouter();

    const [search, setSearch] = useState('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const cartCount = useSelector(state => state.cart.total)

    const handleSearch = (e) => {
        e.preventDefault()
        if (search.trim()) {
            router.push(`/shop?search=${search}`)
            setMobileMenuOpen(false)
        }
    }

    return (
        <nav className="relative bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="mx-4 sm:mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-3 sm:py-4 transition-all">

                    {/* Janan Fashion logo */}
                    <Link href="/" className="shrink-0 flex items-center" style={{ height: '40px', textDecoration: 'none' }}>
                        <img
                            src="/turabi-logo.png"
                            alt="Janan Fashion Logo"
                            className="h-10 sm:h-12 w-auto object-contain block"
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600 font-medium text-sm">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                        <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                        <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-2.5 rounded-full border border-transparent focus-within:border-slate-300">
                            <Search size={16} className="text-slate-500" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-500" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

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
                    <form onSubmit={handleSearch} className="flex items-center gap-2 bg-slate-100 px-4 py-3 rounded-xl">
                        <Search size={18} className="text-slate-500 shrink-0" />
                        <input className="w-full bg-transparent outline-none text-sm placeholder-slate-500" type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="submit" className="text-xs font-bold bg-primary text-slate-900 px-3 py-1.5 rounded-lg shrink-0">Search</button>
                    </form>

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