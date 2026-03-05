'use client'
import { useEffect, useState, useMemo, Fragment } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import toast from "react-hot-toast"
import Pagination from "@/components/admin/Pagination"
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal"
import { exportToCSV } from "@/lib/csvExport"

const PER_PAGE = 10
const STATUS_CONFIG = {
    PENDING: { label: "Pending", cls: "bg-amber-100 text-amber-600", icon: "schedule" },
    PROCESSING: { label: "Processing", cls: "bg-blue-100 text-blue-600", icon: "sync" },
    SHIPPED: { label: "Shipped", cls: "bg-purple-100 text-purple-600", icon: "local_shipping" },
    DELIVERED: { label: "Delivered", cls: "bg-primary/10 text-primary", icon: "check_circle" },
    CANCELLED: { label: "Cancelled", cls: "bg-red-100 text-red-500", icon: "cancel" },
}
const ALL_STATUSES = Object.keys(STATUS_CONFIG)

export default function AdminOrders() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'Rs';
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filterStatus, setFStatus] = useState("ALL")
    const [expanded, setExpanded] = useState(null)
    const [page, setPage] = useState(1)
    const [cancelTarget, setCancelTarget] = useState(null)

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/orders')
            const data = await res.json()
            if (data.success) {
                setOrders(data.data)
            }
        } catch (error) {
            toast.error("Failed to load orders")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const filtered = useMemo(() => orders.filter(o => {
        const matchStatus = filterStatus === "ALL" || o.status === filterStatus
        const matchSearch = o.id.includes(search) || (o.trackingId && o.trackingId.includes(search.toUpperCase())) || o.user?.name?.toLowerCase().includes(search.toLowerCase())
        return matchStatus && matchSearch
    }), [orders, search, filterStatus])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    const changeStatus = async (id, status) => {
        // Optimistic UI update
        const originalOrders = [...orders]
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))

        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            const data = await res.json()
            if (data.success) {
                toast.success(`Status → ${STATUS_CONFIG[status].label}`)
            } else {
                setOrders(originalOrders)
                toast.error(data.message || "Failed to update status")
            }
        } catch (error) {
            setOrders(originalOrders)
            toast.error("Error updating status")
        }
    }

    const confirmCancel = (id) => setCancelTarget(id)
    const executeCancel = async () => {
        if (!cancelTarget) return;

        const toastId = toast.loading("Deleting order...");
        try {
            const res = await fetch(`/api/admin/orders/${cancelTarget}`, {
                method: 'DELETE'
            })
            const data = await res.json()

            if (data.success) {
                setOrders(prev => prev.filter(o => o.id !== cancelTarget))
                toast.success("Order deleted successfully", { id: toastId })
            } else {
                toast.error(data.message || "Failed to delete error", { id: toastId })
            }
        } catch (error) {
            toast.error("Error deleting order", { id: toastId })
        } finally {
            setCancelTarget(null)
        }
    }

    const handleExport = () => {
        const rows = filtered.map(o => ({
            ID: o.id, Customer: o.user?.name, Total: o.total,
            Status: o.status, Payment: o.paymentMethod,
            PaymentAccount: o.paymentAccount || "-",
            Paid: o.isPaid ? "Yes" : "No",
            Date: o.createdAt ? format(new Date(o.createdAt), "yyyy-MM-dd") : ""
        }))
        exportToCSV(rows, "orders")
        toast.success("Exported as orders.csv")
    }

    const handleSearch = (v) => { setSearch(v); setPage(1) }
    const handleFilter = (v) => { setFStatus(v); setPage(1) }

    if (loading) return <div className="p-10 text-slate-400">Loading...</div>

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">Orders <span className="text-slate-400 font-medium">Management</span></h1>
                    <p className="text-sm text-slate-500 mt-1">{orders.length} total orders</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {["PENDING", "PROCESSING", "SHIPPED"].map(s => (
                        <div key={s} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${STATUS_CONFIG[s].cls}`}>
                            <span className="material-symbols-outlined text-sm">{STATUS_CONFIG[s].icon}</span>
                            {orders.filter(o => o.status === s).length} {STATUS_CONFIG[s].label}
                        </div>
                    ))}
                    <button onClick={handleExport} className="flex items-center gap-2 border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Export
                    </button>
                </div>
            </div>

            {/* Search + filter */}
            <div className="bg-white rounded-2xl px-5 py-3.5 shadow-sm shadow-primary/5 border border-primary/5 flex items-center gap-4 flex-wrap">
                <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
                <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search tracking ID or customer…"
                    className="flex-1 min-w-[160px] bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
                <div className="flex items-center gap-1 border-l border-slate-100 pl-4 flex-wrap">
                    {["ALL", ...ALL_STATUSES].map(s => (
                        <button key={s} onClick={() => handleFilter(s)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${filterStatus === s ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100"}`}>
                            {s === "ALL" ? "All" : STATUS_CONFIG[s].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm shadow-primary/5 border border-primary/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] uppercase tracking-widest font-bold text-slate-400">
                                <th className="px-5 py-4">Order ID</th>
                                <th className="px-5 py-4">Customer</th>
                                <th className="px-5 py-4">Items</th>
                                <th className="px-5 py-4">Total</th>
                                <th className="px-5 py-4">Payment</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Date</th>
                                <th className="px-5 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginated.length === 0 && (
                                <tr><td colSpan={8} className="px-6 py-16 text-center text-slate-400 text-sm">No orders found.</td></tr>
                            )}
                            {paginated.map(order => (
                                <Fragment key={order.id}>
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <Link href={`/admin/orders/${order.id}`} className="text-sm font-mono text-primary hover:underline" title={`UUID: ${order.id}`}>
                                                {order.trackingId || order.id.slice(-8).toUpperCase()}
                                            </Link>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                {typeof order.user?.image === 'string' && order.user.image.startsWith('http') ? (
                                                    <Image src={order.user.image} alt={order.user.name || 'User'} width={28} height={28} className="size-7 rounded-full object-cover" />
                                                ) : (
                                                    <div className="size-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">{order.user?.name?.[0] || 'U'}</div>
                                                )}
                                                <span className="text-sm font-semibold">{order.user?.name || "Unknown"}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <button onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                                                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                                                {order.orderItems?.length} items
                                                <span className="material-symbols-outlined text-sm">{expanded === order.id ? "expand_less" : "expand_more"}</span>
                                            </button>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm font-bold text-slate-900">{currency}{order.total?.toFixed(2)}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${order.isPaid ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-600"}`}>
                                                {order.isPaid ? "Paid" : order.paymentMethod || "COD"}
                                            </span>
                                            {order.paymentAccount && <p className="text-[10px] text-slate-500 mt-1">{order.paymentAccount}</p>}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${STATUS_CONFIG[order.status]?.cls || "bg-slate-100 text-slate-500"}`}>
                                                <span className="material-symbols-outlined text-xs">{STATUS_CONFIG[order.status]?.icon}</span>
                                                {STATUS_CONFIG[order.status]?.label || order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-slate-500">
                                            {order.createdAt ? format(new Date(order.createdAt), "MMM d, yyyy") : "–"}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-1.5">
                                                <select value={order.status} onChange={e => changeStatus(order.id, e.target.value)}
                                                    className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                                                    {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                                                </select>
                                                {order.status !== "CANCELLED" && (
                                                    <button onClick={() => confirmCancel(order.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Cancel order">
                                                        <span className="material-symbols-outlined text-sm">cancel</span>
                                                    </button>
                                                )}
                                                <Link href={`/admin/orders/${order.id}`} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="View detail">
                                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                    {expanded === order.id && (
                                        <tr key={`${order.id}-exp`}>
                                            <td colSpan={8} className="px-5 pb-4 bg-slate-50/50">
                                                <div className="rounded-xl border border-slate-100 overflow-hidden">
                                                    {order.orderItems?.map((item, i) => (
                                                        <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-slate-100 last:border-0 bg-white">
                                                            <div className="size-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                                                {item.product?.images?.[0] && <Image src={item.product.images[0]} alt="" width={40} height={40} className="object-cover w-full h-full" />}
                                                            </div>
                                                            <div className="flex-1"><p className="text-sm font-semibold">{item.product?.name}</p><p className="text-xs text-slate-400">Qty: {item.quantity}</p></div>
                                                            <p className="text-sm font-bold">{currency}{item.price}</p>
                                                        </div>
                                                    ))}
                                                    <div className="bg-slate-50 px-4 py-3 flex flex-col gap-2">
                                                        <div className="flex justify-between items-start">
                                                            <div className="text-xs text-slate-600 flex flex-col gap-0.5">
                                                                <p><span className="font-semibold text-slate-800">Ship to:</span> {order.address?.name || "Unknown"} <span className="font-mono ml-2">{order.address?.phone || ""}</span> {order.address?.emergencyContact ? <span className="text-amber-600 ml-1">(Alt: {order.address.emergencyContact})</span> : ""}</p>
                                                                <p className="mt-1">{order.address?.street || ""}{order.address?.landmark ? <span className="ml-1 font-semibold text-primary">({order.address.landmark})</span> : ""}</p>
                                                                <p>{order.address?.city || ""}{order.address?.country ? `, ${order.address.country}` : ""}</p>
                                                            </div>
                                                            <span className="text-sm font-bold">Total: {currency}{order.total?.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-5 pb-4">
                    <Pagination page={page} totalPages={totalPages} onChange={p => { setPage(p); setExpanded(null) }} />
                </div>
            </div>

            <DeleteConfirmModal
                open={!!cancelTarget}
                title="Delete this order permanently?"
                description="Are you sure you want to completely delete this order and all its items? This action cannot be undone."
                confirmLabel="Delete Order"
                onConfirm={executeCancel}
                onCancel={() => setCancelTarget(null)}
            />
        </div>
    )
}
