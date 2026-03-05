'use client'
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { productDummyData, orderDummyData } from "@/assets/assets"

const NOTIFICATIONS = [
    { id: 1, icon: "shopping_cart", title: "New order received", desc: "#9016H1P3 · $214.20", time: "2m ago", read: false },
    { id: 2, icon: "store", title: "New store application", desc: "TechZone PK needs review", time: "18m ago", read: false },
    { id: 3, icon: "person_add", title: "New user registered", desc: "alice@example.com joined", time: "1h ago", read: true },
    { id: 4, icon: "check_circle", title: "Order delivered", desc: "#VMM3GXAF completed", time: "3h ago", read: true },
    { id: 5, icon: "inventory_2", title: "Low stock alert", desc: "Smart Watch Black · 3 left", time: "5h ago", read: true },
]

const AdminNavbar = ({ onMenuClick }) => {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [showSearch, setShowSearch] = useState(false)
    const [showNotif, setShowNotif] = useState(false)
    const [notifications, setNotifications] = useState(NOTIFICATIONS)
    const [darkMode, setDarkMode] = useState(false)
    const searchRef = useRef(null)
    const notifRef = useRef(null)

    // Dark mode toggle
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }, [darkMode])

    // Global search
    useEffect(() => {
        if (!search.trim()) { setSearchResults([]); return }
        const q = search.toLowerCase()
        const products = productDummyData
            .filter(p => p.name.toLowerCase().includes(q))
            .slice(0, 3)
            .map(p => ({ type: "Product", label: p.name, href: "/admin/products" }))
        const orders = orderDummyData
            .filter(o => o.id.toLowerCase().includes(q) || o.user?.name?.toLowerCase().includes(q))
            .slice(0, 2)
            .map(o => ({ type: "Order", label: `#${o.id.slice(-8).toUpperCase()} · ${o.user?.name}`, href: `/admin/orders/${o.id}` }))
        setSearchResults([...products, ...orders])
    }, [search])

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false)
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const unreadCount = notifications.filter(n => !n.read).length
    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))

    const handleSearchSelect = (href) => {
        router.push(href)
        setSearch("")
        setShowSearch(false)
    }

    return (
        <header className="h-16 bg-white dark:bg-[#101010] sticky top-0 z-40 px-4 lg:px-10 flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] gap-4 transition-colors duration-200">
            {/* Mobile hamburger */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors shrink-0"
            >
                <span className="material-symbols-outlined">menu</span>
            </button>

            {/* Search */}
            <div ref={searchRef} className="relative w-full max-w-sm group hidden sm:block">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 text-sm group-focus-within:text-primary transition-colors">search</span>
                <input
                    className="w-full bg-slate-100/60 dark:bg-white/5 dark:text-slate-200 dark:placeholder:text-slate-600 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 transition-all"
                    placeholder="Search products, orders…"
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setShowSearch(true) }}
                    onFocus={() => setShowSearch(true)}
                />
                {/* Search dropdown */}
                {showSearch && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#111] rounded-xl shadow-xl border border-slate-100 dark:border-white/5 overflow-hidden z-50">
                        {searchResults.map((r, i) => (
                            <button key={i} onClick={() => handleSearchSelect(r.href)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 text-left transition-colors">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${r.type === "Product" ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-600"}`}>{r.type}</span>
                                <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{r.label}</span>
                            </button>
                        ))}
                    </div>
                )}
                {showSearch && search && searchResults.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#111] rounded-xl shadow-xl border border-slate-100 dark:border-white/5 px-4 py-6 text-center z-50">
                        <p className="text-sm text-slate-400">No results for "<span className="font-semibold">{search}</span>"</p>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
                {/* Notifications */}
                <div ref={notifRef} className="relative">
                    <button
                        onClick={() => { setShowNotif(v => !v); setShowSearch(false) }}
                        className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors relative"
                    >
                        <span className="material-symbols-outlined text-[22px]">notifications</span>
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotif && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#111] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden z-50">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/5">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button onClick={markAllRead} className="text-xs text-primary font-semibold hover:underline">Mark all read</button>
                                )}
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-80 overflow-y-auto">
                                {notifications.map(n => (
                                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 transition-colors ${n.read ? "" : "bg-primary/5"}`}>
                                        <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${n.read ? "bg-slate-100 dark:bg-white/5" : "bg-primary/10"}`}>
                                            <span className={`material-symbols-outlined text-sm ${n.read ? "text-slate-500 dark:text-slate-400" : "text-primary"}`}>{n.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-semibold ${n.read ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-slate-100"}`}>{n.title}</p>
                                            <p className="text-xs text-slate-400 truncate">{n.desc}</p>
                                        </div>
                                        <span className="text-[10px] text-slate-400 shrink-0 mt-1">{n.time}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-2.5 border-t border-slate-100 dark:border-white/5">
                                <button className="w-full text-xs text-primary font-semibold text-center hover:underline">View all notifications</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Dark mode toggle */}
                <button
                    onClick={() => setDarkMode(v => !v)}
                    className={`p-2.5 rounded-xl transition-all ${darkMode ? "bg-[#0df259]/10 text-primary" : "text-slate-500 hover:bg-slate-100"}`}
                >
                    <span className="material-symbols-outlined text-[22px]">{darkMode ? "light_mode" : "dark_mode"}</span>
                </button>

                <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-1" />

                {/* Admin profile */}
                <div className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold group-hover:text-primary transition-colors dark:text-slate-200">Alex Rivera</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Administrator</p>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="Profile" className="size-9 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbWqTInX8PL0JJXFLbewbvHRt4fIE1fs0caL83S4MqpabALUCvUp_0_cch6Zya9mkj9pWKABiFEqbahx9H0ktg30fyWUjzx8DhJ8Rfse8e-XYxTS1tZHMgzaF_VTNnnbr6oBKyrsBsnuqkkDPZ9v8x5d66ujGi1aQEMuLsSBRkJavFbn0jZtRv8Is-7vTwQkAkdD4TJGt4Y8GP6G8X68_OJDmlYqGjCT_7K0QsWM1bw6I9CSXFk8Ey6IHHoKMr3AFol9cDjj7BdqY" />
                </div>
            </div>
        </header>
    )
}

export default AdminNavbar