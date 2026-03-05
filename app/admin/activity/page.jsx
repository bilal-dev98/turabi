'use client'
import { useState } from "react"
import { format } from "date-fns"

const BASE_ACTIVITY = [
    { id: 1, type: "order", icon: "shopping_cart", color: "bg-primary/10 text-primary", title: "New order placed", desc: "Order #9016H1P3 · $214.20 by GreatStack", time: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
    { id: 2, type: "store", icon: "store", color: "bg-blue-100 text-blue-600", title: "Store approved", desc: "TechZone PK was approved by admin", time: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
    { id: 3, type: "user", icon: "person_add", color: "bg-purple-100 text-purple-600", title: "New user registered", desc: "alice@example.com joined the platform", time: new Date(Date.now() - 65 * 60 * 1000).toISOString() },
    { id: 4, type: "product", icon: "inventory_2", color: "bg-amber-100 text-amber-600", title: "Product added", desc: "Smart Watch Ultra Black added by TechZone PK", time: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
    { id: 5, type: "coupon", icon: "sell", color: "bg-pink-100 text-pink-600", title: "Coupon created", desc: "SAVE20 (20% OFF) valid until Feb 28", time: new Date(Date.now() - 3 * 3600 * 1000).toISOString() },
    { id: 6, type: "order", icon: "local_shipping", color: "bg-primary/10 text-primary", title: "Order shipped", desc: "Order #VMM3GXAF marked as Shipped", time: new Date(Date.now() - 5 * 3600 * 1000).toISOString() },
    { id: 7, type: "user", icon: "block", color: "bg-red-100 text-red-500", title: "User banned", desc: "bob@example.com was banned by admin", time: new Date(Date.now() - 6 * 3600 * 1000).toISOString() },
    { id: 8, type: "store", icon: "pending", color: "bg-amber-100 text-amber-600", title: "Store application received", "desc": "Organic Bliss applied for store approval", time: new Date(Date.now() - 8 * 3600 * 1000).toISOString() },
    { id: 9, type: "product", icon: "delete", color: "bg-red-100 text-red-500", title: "Product deleted", desc: "Wireless Mouse Pro removed from catalog", time: new Date(Date.now() - 10 * 3600 * 1000).toISOString() },
    { id: 10, type: "order", icon: "check_circle", color: "bg-primary/10 text-primary", title: "Order delivered", desc: "Order #8922 marked as Delivered", time: new Date(Date.now() - 12 * 3600 * 1000).toISOString() },
    { id: 11, type: "settings", icon: "settings", color: "bg-slate-100 text-slate-500", title: "Settings updated", desc: "Currency changed to USD by admin", time: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
    { id: 12, type: "coupon", icon: "cancel", color: "bg-red-100 text-red-500", title: "Coupon expired", desc: "WELCOME10 coupon has expired", time: new Date(Date.now() - 30 * 3600 * 1000).toISOString() },
]

const TYPE_FILTERS = ["all", "order", "store", "user", "product", "coupon", "settings"]

function timeAgo(isoDate) {
    const diff = Date.now() - new Date(isoDate)
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
}

export default function AdminActivity() {
    const [filter, setFilter] = useState("all")
    const [search, setSearch] = useState("")

    const filtered = BASE_ACTIVITY.filter(a => {
        const matchType = filter === "all" || a.type === filter
        const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase())
        return matchType && matchSearch
    })

    return (
        <div className="p-6 lg:p-10 max-w-4xl mx-auto w-full space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">Activity <span className="text-slate-400 font-medium">Log</span></h1>
                <p className="text-sm text-slate-500 mt-1">{BASE_ACTIVITY.length} events recorded</p>
            </div>

            {/* Filter + Search bar */}
            <div className="bg-white rounded-2xl px-5 py-3.5 shadow-sm shadow-primary/5 border border-primary/5 flex items-center gap-4 flex-wrap">
                <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activity…"
                    className="flex-1 min-w-[140px] bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
                <div className="flex items-center gap-1 border-l border-slate-100 pl-4 flex-wrap">
                    {TYPE_FILTERS.map(t => (
                        <button key={t} onClick={() => setFilter(t)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${filter === t ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100"}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-sm shadow-primary/5 border border-primary/5 p-6">
                {filtered.length === 0 && (
                    <div className="py-16 text-center text-slate-400 text-sm">No activity found.</div>
                )}

                <div className="space-y-6 relative">
                    {/* Vertical line */}
                    <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-100" />

                    {filtered.map((activity, i) => (
                        <div key={activity.id} className="relative flex gap-4">
                            {/* Icon dot */}
                            <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 z-10 ${activity.color}`}>
                                <span className="material-symbols-outlined text-sm">{activity.icon}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{activity.desc}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[10px] font-semibold text-slate-400">{timeAgo(activity.time)}</p>
                                        <p className="text-[10px] text-slate-300 mt-0.5">{format(new Date(activity.time), "h:mm a")}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Day separator */}
                            {i < filtered.length - 1 && (() => {
                                const thisDate = format(new Date(activity.time), "yyyy-MM-dd")
                                const nextDate = format(new Date(filtered[i + 1].time), "yyyy-MM-dd")
                                if (thisDate !== nextDate) {
                                    return (
                                        <div className="absolute left-0 right-0 -bottom-3 flex items-center gap-3 pl-12">
                                            <div className="flex-1 h-px bg-slate-100" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {format(new Date(filtered[i + 1].time), "MMMM d")}
                                            </span>
                                            <div className="flex-1 h-px bg-slate-100" />
                                        </div>
                                    )
                                }
                            })()}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
