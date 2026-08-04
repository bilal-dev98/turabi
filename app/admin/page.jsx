'use client'
import { dummyAdminDashboardData } from "@/assets/assets"
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSelector } from "react-redux"

const KPI_CONFIG = [
    { key: "revenue", label: "Total Revenue", icon: "payments", prefix: true, format: v => Number(v || 0).toLocaleString(), color: "emerald", suffix: "Lifetime" },
    { key: "dailySales", label: "Daily Sales", icon: "trending_up", prefix: true, format: v => Number(v || 0).toLocaleString(), color: "blue", suffix: "Last 24h" },
    { key: "orders", label: "Total Orders", icon: "receipt_long", prefix: false, format: v => Number(v || 0).toLocaleString(), color: "violet", suffix: "Placed" },
    { key: "users", label: "Total Users", icon: "group", prefix: false, format: v => Number(v || 0).toLocaleString(), color: "amber", suffix: "Registered" },
    { key: "avgOrderValue", label: "Avg. Order Value", icon: "insights", prefix: true, format: v => Number(v || 0).toFixed(2), color: "rose", suffix: "Average" },
]

const colorMap = {
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
}

const statusBadge = {
    DELIVERED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    ORDER_PLACED: "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
    PROCESSING: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    SHIPPED: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
    CANCELLED: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
}

export default function AdminDashboard() {
    const currency = useSelector(state => state.settings.currency) || '$'
    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState("24h")
    const [dashboardData, setDashboardData] = useState({
        products: 0, revenue: 0, orders: 0, users: 0,
        dailySales: 0, avgOrderValue: 0, abandonedCarts: 0,
        recentOrders: [], activities: [],
    })

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/admin/dashboard')
            const data = await res.json()
            if (data.success) setDashboardData(data.data)
        } catch (error) {
            console.error("Failed to load dashboard metrics:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchDashboardData() }, [])

    if (loading) return <Loading />

    return (
        <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Dashboard</h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Welcome back — here's what's happening today.</p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-[4px]">
                    <span className="material-symbols-outlined text-sm text-emerald-500">radio_button_checked</span>
                    Live
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {KPI_CONFIG.map(({ key, label, icon, prefix, format, color, suffix }) => (
                    <div key={key} className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-4 flex flex-col gap-3 shadow-xs hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{label}</p>
                            <div className={`size-7 rounded-[4px] flex items-center justify-center ${colorMap[color]}`}>
                                <span className="material-symbols-outlined text-sm">{icon}</span>
                            </div>
                        </div>
                        <p className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white leading-none">
                            {prefix ? currency : ""}{format(dashboardData[key])}
                        </p>
                        <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">{suffix}</p>
                    </div>
                ))}
            </div>

            {/* Chart + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Sales Overview</h2>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{currency}{Number(dashboardData.revenue).toFixed(2)}</span>
                                <span className="text-xs font-bold text-emerald-500">+14.2%</span>
                            </div>
                        </div>
                        <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-[4px]">
                            {["24h", "7d", "30d"].map(r => (
                                <button key={r} onClick={() => setDateRange(r)}
                                    className={`px-2.5 py-1 text-[11px] font-bold rounded-[4px] transition-all ${dateRange === r ? "bg-white dark:bg-slate-700 text-zinc-900 dark:text-white shadow-xs" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"}`}>
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="w-full relative min-h-[220px]">
                        <OrdersAreaChart />
                    </div>
                </div>

                {/* Activity feed */}
                <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-5 shadow-xs flex flex-col">
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">User Activity</h2>
                    <div className="flex-1 overflow-y-auto space-y-4 relative custom-scrollbar">
                        <div className="absolute left-3.5 top-2 bottom-2 w-px bg-zinc-100 dark:bg-zinc-800" />
                        {dashboardData.activities && dashboardData.activities.length > 0 ? (
                            dashboardData.activities.map((activity, i) => (
                                <div key={i} className="relative flex gap-3 pl-0.5">
                                    <div className={`size-7 rounded-full ${activity.bg || "bg-zinc-100 dark:bg-zinc-800"} flex items-center justify-center z-10 shrink-0`}>
                                        <span className={`material-symbols-outlined ${activity.color || "text-zinc-500"} text-sm`}>{activity.icon}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{activity.title}</p>
                                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{activity.desc}</p>
                                        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-0.5 uppercase font-bold tracking-wider">
                                            {new Date(activity.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-zinc-400 text-center py-8">No recent activity.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                        View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                            <tr>
                                {["Order ID", "Customer", "Products", "Amount", "Status", ""].map(h => (
                                    <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {dashboardData.recentOrders && dashboardData.recentOrders.length > 0 ? (
                                dashboardData.recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-5 py-3 text-xs font-mono font-bold text-zinc-600 dark:text-zinc-300">
                                            #{(order.trackingId || order.id.slice(-8)).toUpperCase()}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                {order.user?.image && order.user.image.startsWith('http') ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img className="size-7 rounded-[4px] object-cover" alt={order.user?.name || 'User'} src={order.user.image} />
                                                ) : (
                                                    <div className="size-7 rounded-[4px] bg-zinc-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-zinc-500 dark:text-zinc-300">
                                                        {order.user?.name ? order.user.name.substring(0, 2).toUpperCase() : 'GU'}
                                                    </div>
                                                )}
                                                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">{order.user?.name || 'Guest User'}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center">
                                                {order.orderItems?.slice(0, 3).map((item, i) => (
                                                    <div key={i} className="size-8 rounded-[4px] overflow-hidden bg-zinc-100 dark:bg-slate-700 border-2 border-white dark:border-slate-900 shrink-0 -ml-1.5 first:ml-0 shadow-xs" title={item.product?.name}>
                                                        {item.product?.images?.[0] ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={item.product.images[0]} alt={item.product.name || ''} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <span className="material-symbols-outlined text-zinc-400 text-xs">checkroom</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {order.orderItems?.length > 3 && (
                                                    <div className="size-8 rounded-[4px] bg-zinc-100 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-bold text-zinc-500 -ml-1.5 shadow-xs">
                                                        +{order.orderItems.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-xs font-bold text-zinc-900 dark:text-white">{currency}{order.total?.toFixed(2) || '0.00'}</td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${statusBadge[order.status] || "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                                                {(order.status || 'ORDER_PLACED').replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-2 py-1 rounded-[4px] hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-5 py-12 text-center text-zinc-400 dark:text-zinc-600 text-sm">No recent orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}