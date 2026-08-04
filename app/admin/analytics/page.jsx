'use client'
import { useEffect, useState } from "react"
import { dummyAdminDashboardData, orderDummyData } from "@/assets/assets"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"]

function StatCard({ icon, label, value, change, positive }) {
    return (
        <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-4 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{label}</p>
                <div className="size-8 rounded-[4px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-base">{icon}</span>
                </div>
            </div>
            <div>
                <p className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white leading-none">{value}</p>
                <p className={`text-[11px] font-semibold mt-1.5 flex items-center gap-0.5 ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
                    <span className="material-symbols-outlined text-xs">{positive ? "trending_up" : "trending_down"}</span>
                    {change}
                </p>
            </div>
        </div>
    )
}

export default function AdminAnalytics() {
    const [data, setData] = useState(null)

    useEffect(() => {
        const d = dummyAdminDashboardData
        const grouped = {}
        d.allOrders.forEach(o => {
            const day = new Date(o.createdAt).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })
            grouped[day] = (grouped[day] || 0) + o.total
        })
        const revenueChart = Object.entries(grouped).map(([day, revenue]) => ({ day, revenue: +revenue.toFixed(2) }))

        const catData = [
            { name: "Clothing", value: 42 },
            { name: "Footwear", value: 25 },
            { name: "Accessories", value: 18 },
            { name: "Other", value: 15 },
        ]

        const trafficData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({
            day, sessions: Math.floor(Math.random() * 800 + 200), conversions: Math.floor(Math.random() * 80 + 20)
        }))

        setData({ revenueChart, catData, trafficData, raw: d })
    }, [])

    if (!data) return <div className="p-8 flex items-center gap-3 text-zinc-400 dark:text-zinc-500 text-sm"><span className="material-symbols-outlined animate-spin text-emerald-500">progress_activity</span>Loading analytics…</div>

    return (
        <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Analytics</h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Platform-wide performance insights & sales distribution.</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard icon="payments" label="Total Revenue" value={`Rs ${data.raw.revenue}`} change="+14.2% this week" positive />
                <StatCard icon="shopping_cart" label="Total Orders" value={data.raw.orders} change="+3 this week" positive />
                <StatCard icon="inventory_2" label="Products Listed" value={data.raw.products} change="+2 new" positive />
                <StatCard icon="storefront" label="Active Stores" value={data.raw.stores} change="+1 this month" positive />
            </div>

            {/* Revenue Chart */}
            <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-5 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Revenue Over Time</h2>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Cumulative daily revenue from all orders</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-[4px] text-xs font-bold">
                        <div className="size-2 rounded-full bg-emerald-500" />
                        <span>Revenue (Rs)</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={data.revenueChart}>
                        <defs>
                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <Tooltip formatter={(v) => [`Rs ${v}`, "Revenue"]} contentStyle={{ borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12px" }} />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Traffic Chart */}
                <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-5 shadow-xs">
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-0.5">Weekly Traffic</h2>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-4">Sessions vs conversions this week</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={data.trafficData} barGap={2}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} vertical={false} />
                            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12px" }} />
                            <Bar dataKey="sessions" fill="#10b981" radius={[4, 4, 0, 0]} fillOpacity={0.8} name="Sessions" />
                            <Bar dataKey="conversions" fill="#059669" radius={[4, 4, 0, 0]} name="Conversions" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Pie */}
                <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-5 shadow-xs">
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-0.5">Sales by Category</h2>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-4">Top performing product categories</p>
                    <div className="flex items-center gap-4">
                        <ResponsiveContainer width="50%" height={180}>
                            <PieChart>
                                <Pie data={data.catData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                                    {data.catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(v) => [`${v}%`, "Share"]} contentStyle={{ borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12px" }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex-1 space-y-2.5">
                            {data.catData.map((cat, i) => (
                                <div key={cat.name} className="flex items-center gap-2.5">
                                    <div className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <div className="flex items-center justify-between flex-1 text-xs">
                                        <span className="text-zinc-700 dark:text-zinc-300 font-medium">{cat.name}</span>
                                        <span className="font-bold text-zinc-900 dark:text-white">{cat.value}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Orders */}
            <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-5 shadow-xs">
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Top Orders by Value</h2>
                <div className="space-y-2.5">
                    {[...orderDummyData].sort((a, b) => b.total - a.total).map(o => (
                        <div key={o.id} className="flex items-center gap-3 p-2.5 rounded-[4px] hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                            <div className="size-8 rounded-[4px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-sm">receipt</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">{o.user?.name || "Customer"}</p>
                                <p className="text-[10px] text-zinc-400 font-mono">#{(o.trackingId || o.id.slice(-8)).toUpperCase()}</p>
                            </div>
                            <p className="text-xs font-bold text-zinc-900 dark:text-white">Rs {o.total?.toFixed(2)}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] ${o.status === "DELIVERED" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"}`}>{o.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
