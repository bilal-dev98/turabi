'use client'
import { useState } from "react"
import { format } from "date-fns"

const BASE_ACTIVITY = [
    { id: 1, type: "order", icon: "shopping_cart", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400", title: "New order placed", desc: "Order #9016H1P3 · Rs 214.20 by GreatStack", time: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
    { id: 2, type: "store", icon: "store", color: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400", title: "Store approved", desc: "TechZone PK was approved by admin", time: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
    { id: 3, type: "user", icon: "person_add", color: "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400", title: "New user registered", desc: "alice@example.com joined the platform", time: new Date(Date.now() - 65 * 60 * 1000).toISOString() },
    { id: 4, type: "product", icon: "inventory_2", color: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400", title: "Product added", desc: "Cotton Kurta Set added to store", time: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
    { id: 5, type: "coupon", icon: "sell", color: "bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400", title: "Coupon created", desc: "SAVE20 (20% OFF) valid until Feb 28", time: new Date(Date.now() - 3 * 3600 * 1000).toISOString() },
    { id: 6, type: "order", icon: "local_shipping", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400", title: "Order shipped", desc: "Order #VMM3GXAF marked as Shipped", time: new Date(Date.now() - 5 * 3600 * 1000).toISOString() },
    { id: 7, type: "user", icon: "block", color: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400", title: "User banned", desc: "bob@example.com was banned by admin", time: new Date(Date.now() - 6 * 3600 * 1000).toISOString() },
    { id: 8, type: "store", icon: "pending", color: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400", title: "Store application received", desc: "Organic Bliss applied for store approval", time: new Date(Date.now() - 8 * 3600 * 1000).toISOString() },
    { id: 9, type: "product", icon: "delete", color: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400", title: "Product deleted", desc: "Silk Shawl removed from catalog", time: new Date(Date.now() - 10 * 3600 * 1000).toISOString() },
    { id: 10, type: "order", icon: "check_circle", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400", title: "Order delivered", desc: "Order #8922 marked as Delivered", time: new Date(Date.now() - 12 * 3600 * 1000).toISOString() },
    { id: 11, type: "settings", icon: "settings", color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300", title: "Settings updated", desc: "Site settings updated by admin", time: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
    { id: 12, type: "coupon", icon: "cancel", color: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400", title: "Coupon expired", desc: "WELCOME10 coupon has expired", time: new Date(Date.now() - 30 * 3600 * 1000).toISOString() },
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
        <div className="p-5 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Activity Log</h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{BASE_ACTIVITY.length} events recorded</p>
            </div>

            {/* Filter + Search bar */}
            <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] px-4 py-2.5 flex items-center gap-3 flex-wrap shadow-xs">
                <span className="material-symbols-outlined text-zinc-400 text-sm">search</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activity…"
                    className="flex-1 min-w-[140px] bg-transparent text-xs text-zinc-700 dark:text-zinc-200 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500" />
                <div className="flex items-center gap-1 border-l border-zinc-200 dark:border-zinc-800 pl-3 flex-wrap">
                    {TYPE_FILTERS.map(t => (
                        <button key={t} onClick={() => setFilter(t)}
                            className={`px-2.5 py-1 rounded-[4px] text-xs font-semibold capitalize transition-all ${filter === t ? "bg-zinc-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] shadow-xs p-5 sm:p-6">
                {filtered.length === 0 && (
                    <div className="py-12 text-center text-zinc-400 dark:text-zinc-600 text-xs">No activity found.</div>
                )}

                <div className="space-y-5 relative">
                    <div className="absolute left-4 top-2 bottom-2 w-px bg-zinc-100 dark:bg-zinc-800" />

                    {filtered.map((activity, i) => (
                        <div key={activity.id} className="relative flex gap-3">
                            <div className={`size-8 rounded-[4px] flex items-center justify-center shrink-0 z-10 ${activity.color}`}>
                                <span className="material-symbols-outlined text-sm">{activity.icon}</span>
                            </div>

                            <div className="flex-1 pt-0.5 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-900 dark:text-white">{activity.title}</p>
                                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{activity.desc}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">{timeAgo(activity.time)}</p>
                                        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-0.5">{format(new Date(activity.time), "h:mm a")}</p>
                                    </div>
                                </div>
                            </div>

                            {i < filtered.length - 1 && (() => {
                                const thisDate = format(new Date(activity.time), "yyyy-MM-dd")
                                const nextDate = format(new Date(filtered[i + 1].time), "yyyy-MM-dd")
                                if (thisDate !== nextDate) {
                                    return (
                                        <div className="absolute left-0 right-0 -bottom-3 flex items-center gap-3 pl-12">
                                            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
                                            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">
                                                {format(new Date(filtered[i + 1].time), "MMMM d")}
                                            </span>
                                            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
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
