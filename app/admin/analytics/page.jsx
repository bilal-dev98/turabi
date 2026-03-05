'use client'
import { useEffect, useState } from "react"
import { dummyAdminDashboardData, orderDummyData } from "@/assets/assets"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

const COLORS = ["#0df259", "#22c55e", "#86efac", "#bbf7d0"]

function StatCard({ icon, label, value, change, positive }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm shadow-primary/5 border border-primary/5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-sm">{icon}</span>
                </div>
            </div>
            <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
                <p className={`text-sm font-semibold mt-1 flex items-center gap-0.5 ${positive ? "text-primary" : "text-red-500"}`}>
                    <span className="material-symbols-outlined text-sm">{positive ? "trending_up" : "trending_down"}</span>
                    {change}
                </p>
            </div>
        </div>
    )
}

export default function AdminAnalytics() {
    const [data, setData] = useState(null)

    useEffect(() => {
        // Build chart-ready data from allOrders
        const d = dummyAdminDashboardData
        const grouped = {}
        d.allOrders.forEach(o => {
            const day = new Date(o.createdAt).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })
            grouped[day] = (grouped[day] || 0) + o.total
        })
        const revenueChart = Object.entries(grouped).map(([day, revenue]) => ({ day, revenue: +revenue.toFixed(2) }))

        // Category breakdown
        const catData = [
            { name: "Electronics", value: 42 },
            { name: "Watches", value: 25 },
            { name: "Audio", value: 18 },
            { name: "Other", value: 15 },
        ]

        // Traffic data
        const trafficData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({
            day, sessions: Math.floor(Math.random() * 800 + 200), conversions: Math.floor(Math.random() * 80 + 20)
        }))

        setData({ revenueChart, catData, trafficData, raw: d })
    }, [])

    if (!data) return <div className="p-10 text-slate-400">Loading analytics...</div>

    return (
        <div className="p-10 max-w-7xl mx-auto w-full space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics <span className="text-slate-400 font-medium">Overview</span></h1>
                <p className="text-sm text-slate-500 mt-1">Platform-wide performance insights</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="payments" label="Total Revenue" value={`$${data.raw.revenue}`} change="+14.2% this week" positive />
                <StatCard icon="shopping_cart" label="Total Orders" value={data.raw.orders} change="+3 this week" positive />
                <StatCard icon="inventory_2" label="Products Listed" value={data.raw.products} change="+2 new" positive />
                <StatCard icon="storefront" label="Active Stores" value={data.raw.stores} change="+1 this month" positive />
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl p-8 shadow-sm shadow-primary/5 border border-primary/5">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Revenue Over Time</h2>
                        <p className="text-sm text-slate-500 mt-0.5">Cumulative daily revenue from all orders</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-xl">
                        <div className="size-2 rounded-full bg-primary" />
                        <span className="text-xs font-bold text-primary">Revenue ($)</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={data.revenueChart}>
                        <defs>
                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0df259" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0df259" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <Tooltip formatter={(v) => [`$${v}`, "Revenue"]} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                        <Area type="monotone" dataKey="revenue" stroke="#0df259" strokeWidth={2.5} fill="url(#revGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Traffic Chart */}
                <div className="bg-white rounded-2xl p-8 shadow-sm shadow-primary/5 border border-primary/5">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Weekly Traffic</h2>
                    <p className="text-sm text-slate-500 mb-6">Sessions vs conversions this week</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={data.trafficData} barGap={2}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                            <Bar dataKey="sessions" fill="#0df259" radius={[4, 4, 0, 0]} fillOpacity={0.8} name="Sessions" />
                            <Bar dataKey="conversions" fill="#22c55e" radius={[4, 4, 0, 0]} name="Conversions" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Pie */}
                <div className="bg-white rounded-2xl p-8 shadow-sm shadow-primary/5 border border-primary/5">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Sales by Category</h2>
                    <p className="text-sm text-slate-500 mb-6">Top performing product categories</p>
                    <div className="flex items-center gap-6">
                        <ResponsiveContainer width="50%" height={200}>
                            <PieChart>
                                <Pie data={data.catData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                                    {data.catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(v) => [`${v}%`, "Share"]} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex-1 space-y-3">
                            {data.catData.map((cat, i) => (
                                <div key={cat.name} className="flex items-center gap-3">
                                    <div className="size-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <div className="flex items-center justify-between flex-1">
                                        <span className="text-sm text-slate-700">{cat.name}</span>
                                        <span className="text-sm font-bold text-slate-900">{cat.value}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent High-Value Orders */}
            <div className="bg-white rounded-2xl p-8 shadow-sm shadow-primary/5 border border-primary/5">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Top Orders by Value</h2>
                <div className="space-y-3">
                    {[...orderDummyData].sort((a, b) => b.total - a.total).map(o => (
                        <div key={o.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary text-sm">receipt</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold">{o.user?.name || "Customer"}</p>
                                <p className="text-xs text-slate-400 font-mono">{o.trackingId || o.id.slice(-8).toUpperCase()}</p>
                            </div>
                            <p className="text-base font-bold text-slate-900">${o.total?.toFixed(2)}</p>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${o.status === "DELIVERED" ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-600"}`}>{o.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
