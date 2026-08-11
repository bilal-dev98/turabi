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
    const [adminProfile, setAdminProfile] = useState({ name: "Alex Rivera", role: "Administrator", image: "" })
    const [darkMode, setDarkMode] = useState(false)
    const searchRef = useRef(null)
    const notifRef = useRef(null)

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const res = await fetch('/api/admin/settings')
                const data = await res.json()
                if (data.success && data.data?.profile) {
                    setAdminProfile({
                        name: data.data.profile.name || "Alex Rivera",
                        role: data.data.profile.role || "Administrator",
                        image: data.data.profile.image || ""
                    })
                }
            } catch (err) {}
        }
        fetchAdminProfile()
    }, [])

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

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/auth/logout', { method: 'POST' })
        } catch (e) {}
        localStorage.removeItem('cj_admin_token')
        window.location.href = '/admin-login.php'
    }

    return (
        <header className="h-16 bg-white dark:bg-[#121215] sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 transition-colors duration-200 shadow-xs">
            {/* Left: Mobile menu toggle + Global search */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[4px] transition-colors shrink-0"
                    title="Toggle menu"
                >
                    <span className="material-symbols-outlined text-xl">menu</span>
                </button>

                {/* Search Input */}
                <div ref={searchRef} className="relative w-full group hidden sm:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm group-focus-within:text-zinc-900 dark:group-focus-within:text-emerald-400 transition-colors pointer-events-none">
                        search
                    </span>
                    <input
                        className="w-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 rounded-[4px] py-1.5 pl-9 pr-4 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 border border-zinc-200 dark:border-zinc-700/80 transition-all"
                        placeholder="Search products, orders, customers…"
                        type="text"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setShowSearch(true) }}
                        onFocus={() => setShowSearch(true)}
                    />
                    {/* Search dropdown */}
                    {showSearch && (searchResults.length > 0 || search.trim() !== "") && (
                        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#16161a] rounded-[4px] shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                            {searchResults.length > 0 ? (
                                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                                    {searchResults.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSearchSelect(item.href)}
                                            className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors text-xs"
                                        >
                                            <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate">{item.label}</span>
                                            <span className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold ml-2 shrink-0">{item.type}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-4 py-3 text-xs text-zinc-400 text-center">No matching products or orders found</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* View Store Quick Button */}
                <Link
                    href="/"
                    target="_blank"
                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-[4px] transition-all"
                    title="Open live storefront"
                >
                    <span className="material-symbols-outlined text-base text-emerald-500">open_in_new</span>
                    <span>View Store</span>
                </Link>

                {/* Notifications Dropdown */}
                <div ref={notifRef} className="relative">
                    <button
                        onClick={() => setShowNotif(prev => !prev)}
                        className="relative p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[4px] transition-colors"
                        title="Notifications"
                    >
                        <span className="material-symbols-outlined text-xl">notifications</span>
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 size-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#121215] animate-pulse" />
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

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-[4px] transition-colors"
                    title="Logout of Admin Panel"
                >
                    <span className="material-symbols-outlined text-xl">logout</span>
                </button>

                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

                {/* Admin profile badge */}
                <div className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-emerald-500 transition-colors">{adminProfile.name}</p>
                        <p className="text-[10px] font-medium text-zinc-400">{adminProfile.role}</p>
                    </div>
                    <div className="relative">
                        {adminProfile.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                alt="Profile"
                                className="size-8 rounded-[4px] object-cover ring-2 ring-transparent group-hover:ring-emerald-500/30 transition-all"
                                src={adminProfile.image}
                            />
                        ) : (
                            <div className="size-8 rounded-[4px] bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                                {(adminProfile.name || "A").slice(0, 2).toUpperCase()}
                            </div>
                        )}
                        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900" />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default AdminNavbar