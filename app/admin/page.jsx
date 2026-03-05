'use client'
import { dummyAdminDashboardData } from "@/assets/assets"
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSelector } from "react-redux"

export default function AdminDashboard() {

    const currency = useSelector(state => state.settings.currency) || '$'

    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState("24h")
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        users: 0,
        dailySales: 0,
        avgOrderValue: 0,
        abandonedCarts: 0,
        recentOrders: [],
        activities: [],
    })

    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.products, icon: ShoppingBasketIcon },
        { title: 'Total Revenue', value: currency + dashboardData.revenue, icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.orders, icon: TagsIcon },
        { title: 'Total Stores', value: dashboardData.stores, icon: StoreIcon },
    ]

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/admin/dashboard')
            const data = await res.json()
            if (data.success) {
                setDashboardData(data.data)
            }
        } catch (error) {
            console.error("Failed to load real dashboard metrics:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="p-10 max-w-7xl mx-auto w-full space-y-10 font-display">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm shadow-primary/5 border border-primary/5 flex flex-col">
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold tracking-tight text-slate-900">{currency}{Number(dashboardData.revenue || 0).toLocaleString()}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-[13px] font-bold text-slate-400">
                        <span className="material-symbols-outlined text-sm">payments</span>
                        <span>Lifetime</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm shadow-primary/5 border border-primary/5 flex flex-col">
                    <p className="text-sm font-medium text-slate-500 mb-1">Daily Sales</p>
                    <p className="text-2xl font-bold tracking-tight text-slate-900">{currency}{Number(dashboardData.dailySales || 0).toLocaleString()}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-[13px] font-bold text-slate-400">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span>Last 24h</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm shadow-primary/5 border border-primary/5 flex flex-col">
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Users</p>
                    <p className="text-2xl font-bold tracking-tight text-slate-900">{Number(dashboardData.users || 0).toLocaleString()}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-[13px] font-bold text-slate-400">
                        <span className="material-symbols-outlined text-sm">people</span>
                        <span>Registered</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm shadow-primary/5 border border-primary/5 flex flex-col">
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold tracking-tight text-slate-900">{Number(dashboardData.orders || 0).toLocaleString()}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-[13px] font-bold text-slate-400">
                        <span className="material-symbols-outlined text-sm">inventory_2</span>
                        <span>Placed</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm shadow-primary/5 border border-primary/5 flex flex-col">
                    <p className="text-sm font-medium text-slate-500 mb-1">Avg. Order Value</p>
                    <p className="text-2xl font-bold tracking-tight text-slate-900">{currency}{Number(dashboardData.avgOrderValue || 0).toFixed(2)}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-[13px] font-bold text-slate-400">
                        <span className="material-symbols-outlined text-sm">insights</span>
                        <span>Average</span>
                    </div>
                </div>
            </div>

            {/* Chart & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-4 h-full">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Live Sales Overview</h2>
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                            {["24h", "7d", "30d"].map(r => (
                                <button key={r} onClick={() => setDateRange(r)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${dateRange === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm shadow-primary/5 border border-primary/5 flex flex-col h-full">
                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-4xl font-bold tracking-tighter text-slate-900">{currency}{Number(dashboardData.revenue).toFixed(2)}</span>
                            <span className="text-primary text-sm font-bold">+14.2%</span>
                        </div>
                        <div className="w-full flex-1 relative min-h-[250px]">
                            <OrdersAreaChart />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 h-full">
                    <h2 className="text-lg font-bold">User Activity</h2>
                    <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm shadow-primary/5 border border-primary/5 overflow-y-auto no-scrollbar h-full">
                        <div className="space-y-8 relative">
                            <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-100"></div>

                            {/* Activity Items */}
                            {dashboardData.activities && dashboardData.activities.length > 0 ? (
                                dashboardData.activities.map((activity, index) => (
                                    <div key={index} className="relative flex gap-4">
                                        <div className={`size-8 rounded-full ${activity.bg} flex items-center justify-center z-10 shrink-0`}>
                                            <span className={`material-symbols-outlined ${activity.color} text-sm`}>{activity.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{activity.title}</p>
                                            <p className="text-xs text-slate-500">{activity.desc}</p>
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                                                {new Date(activity.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-400 text-center py-4">No recent activity.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-sm font-bold text-primary hover:underline">View All Orders</Link>
                </div>
                <div className="bg-white rounded-2xl shadow-sm shadow-primary/5 border border-primary/5 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] uppercase tracking-widest font-bold text-slate-400">
                                <th className="px-8 py-5">Order ID</th>
                                <th className="px-8 py-5">Customer</th>
                                <th className="px-8 py-5">Products</th>
                                <th className="px-8 py-5">Amount</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {dashboardData.recentOrders && dashboardData.recentOrders.length > 0 ? (
                                dashboardData.recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-4 text-sm font-mono text-slate-500 font-bold">{order.trackingId || order.id.slice(-6).toUpperCase()}</td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                {order.user?.image && order.user.image.startsWith('http') ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img className="size-8 rounded-full object-cover" alt={order.user?.name || 'User'} src={order.user.image} />
                                                ) : (
                                                    <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-400">
                                                        {order.user?.name ? order.user.name.substring(0, 2).toUpperCase() : 'U'}
                                                    </div>
                                                )}
                                                <span className="text-sm font-semibold">{order.user?.name || 'Guest User'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            {/* Product thumbnails stack */}
                                            <div className="flex items-center">
                                                {order.orderItems?.slice(0, 3).map((item, i) => (
                                                    <div key={i} className="size-10 rounded-lg overflow-hidden bg-slate-100 border-2 border-white shrink-0 -ml-2 first:ml-0 shadow-sm" title={item.product?.name}>
                                                        {item.product?.images?.[0] ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={item.product.images[0]} alt={item.product.name || ''} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                                                <span className="material-symbols-outlined text-primary text-[14px]">inventory_2</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {order.orderItems?.length > 3 && (
                                                    <div className="size-10 rounded-lg bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500 -ml-2 shadow-sm">
                                                        +{order.orderItems.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-sm font-bold text-slate-900">{currency}{order.total?.toFixed(2) || '0.00'}</td>
                                        <td className="px-8 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase
                                                ${order.status === 'DELIVERED' ? 'bg-primary/10 text-primary'
                                                    : order.status === 'PROCESSING' ? 'bg-amber-100 text-amber-600'
                                                        : order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-600'
                                                            : 'bg-sky-100 text-sky-600'}`}>
                                                {(order.status || 'ORDER_PLACED').replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-primary transition-colors px-2 py-1.5 rounded-lg hover:bg-primary/5" title="View order details">
                                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-10 text-center text-slate-400 text-sm">
                                        No recent orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}