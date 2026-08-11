'use client'
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { productDummyData, orderDummyData } from "@/assets/assets"

const NOTIFICATIONS = [
    { id: 1, icon: "shopping_cart", title: "New order received", desc: "#9016H1P3 · Rs 214.20", time: "2m ago", read: false },
    { id: 2, icon: "store", title: "New store application", desc: "TechZone PK needs review", time: "18m ago", read: false },
    { id: 3, icon: "person_add", title: "New user registered", desc: "alice@example.com joined", time: "1h ago", read: true },
    { id: 4, icon: "check_circle", title: "Order delivered", desc: "#VMM3GXAF completed", time: "3h ago", read: true },
    { id: 5, icon: "inventory_2", title: "Low stock alert", desc: "Smart Watch Black · 3 left", time: "5h ago", read: true },
]

const AdminNavbar = ({ onMenuClick, collapsed, onToggleCollapse }) => {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [showSearch, setShowSearch] = useState(false)
    const [showNotif, setShowNotif] = useState(false)
    const [notifications, setNotifications] = useState(NOTIFICATIONS)
    const [darkMode, setDarkMode] = useState(false)
    const searchRef = useRef(null)
    const notifRef = useRef(null)

    // Load saved dark mode state on mount
    useEffect(() => {
        const saved = localStorage.getItem("admin_theme")
        if (saved === "dark" || (!saved && document.documentElement.classList.contains("dark"))) {
            setDarkMode(true)
            document.documentElement.classList.add("dark")
        } else {
            setDarkMode(false)
            document.documentElement.classList.remove("dark")
        }
    }, [])

    // Toggle dark mode and persist to localStorage
    const toggleDarkMode = () => {
        setDarkMode(prev => {
            const next = !prev
            if (next) {
                document.documentElement.classList.add("dark")
                localStorage.setItem("admin_theme", "dark")
            } else {
                document.documentElement.classList.remove("dark")
                localStorage.setItem("admin_theme", "light")
            }
            return next
        })
    }

    // Global search logic
    useEffect(() => {
        if (!search.trim()) { setSearchResults([]); return }
        const q = search.toLowerCase()
        let active = true

        const searchData = async () => {
            try {
                const [prodRes, ordRes] = await Promise.all([
                    fetch('/api/products').then(r => r.json()).catch(() => ({ data: [] })),
                    fetch('/api/admin/orders').then(r => r.json()).catch(() => ({ data: [] }))
                ])
                if (!active) return

                const matchingProds = (prodRes.data || [])
                    .filter(p => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
                    .slice(0, 3)
                    .map(p => ({ type: "Product", label: p.name, href: "/admin/products" }))

                const matchingOrders = (ordRes.data || [])
                    .filter(o => o.id?.toLowerCase().includes(q) || o.trackingId?.toLowerCase().includes(q) || o.user?.name?.toLowerCase().includes(q))
                    .slice(0, 2)
                    .map(o => ({ type: "Order", label: `#${(o.trackingId || o.id).slice(-8).toUpperCase()} · ${o.user?.name || 'Customer'}`, href: `/admin/orders/${o.id}` }))

                setSearchResults([...matchingProds, ...matchingOrders])
            } catch (err) {
                console.error("Error in admin search:", err)
            }
        }

        const timer = setTimeout(searchData, 250)
        return () => { active = false; clearTimeout(timer) }
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
        <header className="h-16 bg-white dark:bg-[#121215] sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 transition-colors duration-200 shadow-xs">
            {/* Left: Mobile menu toggle + Desktop Collapse + Global search */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[4px] transition-colors shrink-0"
                    title="Toggle menu"
                >
                    <span className="material-symbols-outlined text-xl">menu</span>
                </button>

                <button
                    onClick={onToggleCollapse}
                    className="hidden lg:flex p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[4px] transition-colors shrink-0"
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <span className="material-symbols-outlined text-xl">
                        {collapsed ? "menu_open" : "side_navigation"}
                    </span>
                </button>

                {/* Search Input */}
                <div ref={searchRef} className="relative w-full group hidden sm:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm group-focus-within:text-zinc-900 dark:group-focus-within:text-emerald-400 transition-colors">
                        search
                    </span>
                    <input
                        className="w-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 rounded-[4px] py-1.5 pl-9 pr-4 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-emerald-500/20 border border-zinc-200 dark:border-zinc-700/80 transition-all"
                        placeholder="Search products, orders, customers…"
                        type="text"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setShowSearch(true) }}
                        onFocus={() => setShowSearch(true)}
                    />
                    {/* Search dropdown */}
                    {showSearch && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#16161a] rounded-[4px] shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                            {searchResults.map((r, i) => (
                                <button key={i} onClick={() => handleSearchSelect(r.href)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-left transition-colors border-b border-zinc-100 dark:border-zinc-800/50 last:border-0">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-[4px] ${r.type === "Product" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"}`}>
                                        {r.type}
                                    </span>
                                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200 truncate">{r.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                    {showSearch && search && searchResults.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#16161a] rounded-[4px] shadow-xl border border-zinc-200 dark:border-zinc-800 px-4 py-5 text-center z-50">
                            <p className="text-xs text-zinc-400">No results for "<span className="font-semibold">{search}</span>"</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                {/* Store Preview Link */}
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    <span>View Store</span>
                </a>

                {/* Notifications */}
                <div ref={notifRef} className="relative">
                    <button
                        onClick={() => { setShowNotif(v => !v); setShowSearch(false) }}
                        className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[4px] transition-colors relative"
                        title="Notifications"
                    >
                        <span className="material-symbols-outlined text-xl">notifications</span>
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 size-4 bg-emerald-500 text-zinc-950 text-[10px] font-black rounded-full flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotif && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#16161a] rounded-[4px] shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                                <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button onClick={markAllRead} className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 max-h-72 overflow-y-auto custom-scrollbar">
                                {notifications.map(n => (
                                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 transition-colors ${n.read ? "" : "bg-emerald-50/40 dark:bg-emerald-950/20"}`}>
                                        <div className={`size-7 rounded-[4px] flex items-center justify-center shrink-0 mt-0.5 ${n.read ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-500" : "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"}`}>
                                            <span className="material-symbols-outlined text-sm">{n.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-semibold ${n.read ? "text-zinc-600 dark:text-zinc-300" : "text-zinc-900 dark:text-white"}`}>{n.title}</p>
                                            <p className="text-[11px] text-zinc-400 truncate">{n.desc}</p>
                                        </div>
                                        <span className="text-[10px] text-zinc-400 shrink-0 mt-0.5">{n.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Dark mode toggle button */}
                <button
                    onClick={toggleDarkMode}
                    className={`p-2 rounded-[4px] transition-colors ${darkMode ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-500 hover:bg-zinc-100"}`}
                    title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    <span className="material-symbols-outlined text-xl">{darkMode ? "light_mode" : "dark_mode"}</span>
                </button>

                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

                {/* Admin profile badge */}
                <div className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-emerald-500 transition-colors">Alex Rivera</p>
                        <p className="text-[10px] font-medium text-zinc-400">Administrator</p>
                    </div>
                    <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            alt="Profile"
                            className="size-8 rounded-[4px] object-cover ring-2 ring-transparent group-hover:ring-emerald-500/30 transition-all"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbWqTInX8PL0JJXFLbewbvHRt4fIE1fs0caL83S4MqpabALUCvUp_0_cch6Zya9mkj9pWKABiFEqbahx9H0ktg30fyWUjzx8DhJ8Rfse8e-XYxTS1tZHMgzaF_VTNnnbr6oBKyrsBsnuqkkDPZ9v8x5d66ujGi1aQEMuLsSBRkJavFbn0jZtRv8Is-7vTwQkAkdD4TJGt4Y8GP6G8X68_OJDmlYqGjCT_7K0QsWM1bw6I9CSXFk8Ey6IHHoKMr3AFol9cDjj7BdqY"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900" />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default AdminNavbar