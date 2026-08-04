'use client'
import { useEffect, useState, useMemo, Fragment } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import toast from "react-hot-toast"
import Pagination from "@/components/admin/Pagination"
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal"
import { exportToCSV } from "@/lib/csvExport"
import { getColorHex } from "@/lib/colors"

const PER_PAGE = 10
const STATUS_CONFIG = {
    PENDING: { label: "Pending", cls: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40", icon: "schedule" },
    PROCESSING: { label: "Processing", cls: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40", icon: "sync" },
    SHIPPED: { label: "Shipped", cls: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40", icon: "local_shipping" },
    DELIVERED: { label: "Delivered", cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40", icon: "check_circle" },
    CANCELLED: { label: "Cancelled", cls: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40", icon: "cancel" },
}
const ALL_STATUSES = Object.keys(STATUS_CONFIG)

export default function AdminOrders() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'Rs'
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
        if (!cancelTarget) return

        const toastId = toast.loading("Deleting order...")
        try {
            const res = await fetch(`/api/admin/orders/${cancelTarget}`, {
                method: 'DELETE'
            })
            const data = await res.json()

            if (data.success) {
                setOrders(prev => prev.filter(o => o.id !== cancelTarget))
                toast.success("Order deleted successfully", { id: toastId })
            } else {
                toast.error(data.message || "Failed to delete order", { id: toastId })
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

    if (loading) return <div className="p-8 flex items-center gap-3 text-zinc-400 dark:text-zinc-500 text-sm"><span className="material-symbols-outlined animate-spin text-emerald-500">progress_activity</span>Loading orders…</div>

    return (
        <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Orders</h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{orders.length} total orders</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {["PENDING", "PROCESSING", "SHIPPED"].map(s => (
                        <div key={s} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-bold ${STATUS_CONFIG[s].cls}`}>
                            <span className="material-symbols-outlined text-xs">{STATUS_CONFIG[s].icon}</span>
                            {orders.filter(o => o.status === s).length} {STATUS_CONFIG[s].label}
                        </div>
                    ))}
                    <button onClick={handleExport} className="flex items-center gap-2 border border-slate-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 px-3.5 py-2 rounded-[4px] text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Export
                    </button>
                </div>
            </div>

            {/* Search + Filter */}
            <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] px-4 py-2.5 flex items-center gap-3 flex-wrap shadow-xs">
                <span className="material-symbols-outlined text-zinc-400 text-sm">search</span>
                <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search tracking ID or customer…"
                    className="flex-1 min-w-[160px] bg-transparent text-xs text-zinc-700 dark:text-zinc-200 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500" />
                <div className="flex items-center gap-1 border-l border-zinc-200 dark:border-zinc-800 pl-3 flex-wrap">
                    {["ALL", ...ALL_STATUSES].map(s => (
                        <button key={s} onClick={() => handleFilter(s)}
                            className={`px-2.5 py-1 rounded-[4px] text-xs font-semibold transition-all ${filterStatus === s ? "bg-zinc-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>
                            {s === "ALL" ? "All" : STATUS_CONFIG[s].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                            <tr>
                                {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", "Actions"].map(h => (
                                    <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {paginated.length === 0 && (
                                <tr><td colSpan={8} className="px-6 py-16 text-center text-zinc-400 dark:text-zinc-600 text-sm">No orders found.</td></tr>
                            )}
                            {paginated.map(order => (
                                <Fragment key={order.id}>
                                    <tr className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-5 py-3 text-xs">
                                            <Link href={`/admin/orders/${order.id}`} className="font-mono font-bold text-zinc-900 dark:text-emerald-400 hover:underline" title={`UUID: ${order.id}`}>
                                                #{(order.trackingId || order.id.slice(-8)).toUpperCase()}
                                            </Link>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                {typeof order.user?.image === 'string' && order.user.image.startsWith('http') ? (
                                                    <Image src={order.user.image} alt={order.user.name || 'User'} width={28} height={28} className="size-7 rounded-[4px] object-cover" />
                                                ) : (
                                                    <div className="size-7 rounded-[4px] bg-zinc-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-zinc-500 dark:text-zinc-300">{order.user?.name?.[0] || 'U'}</div>
                                                )}
                                                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">{order.user?.name || "Unknown"}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <button onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                                                className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                                                {order.orderItems?.length} items
                                                <span className="material-symbols-outlined text-sm">{expanded === order.id ? "expand_less" : "expand_more"}</span>
                                            </button>
                                        </td>
                                        <td className="px-5 py-3 text-xs font-bold text-zinc-900 dark:text-white">{currency}{order.total?.toFixed(2)}</td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${order.isPaid ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"}`}>
                                                {order.isPaid ? "Paid" : order.paymentMethod || "COD"}
                                            </span>
                                            {order.paymentAccount && <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{order.paymentAccount}</p>}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[10px] font-bold ${STATUS_CONFIG[order.status]?.cls || "bg-zinc-100 text-zinc-500"}`}>
                                                <span className="material-symbols-outlined text-xs">{STATUS_CONFIG[order.status]?.icon}</span>
                                                {STATUS_CONFIG[order.status]?.label || order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                                            {order.createdAt ? format(new Date(order.createdAt), "MMM d, yyyy") : "–"}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <select value={order.status} onChange={e => changeStatus(order.id, e.target.value)}
                                                    className="text-xs border border-slate-300 dark:border-zinc-700 rounded-[4px] px-2 py-1 text-zinc-700 dark:text-zinc-200 outline-none bg-white dark:bg-zinc-800">
                                                    {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                                                </select>
                                                {order.status !== "CANCELLED" && (
                                                    <button onClick={() => confirmCancel(order.id)} className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-[4px] transition-all" title="Cancel order">
                                                        <span className="material-symbols-outlined text-sm">cancel</span>
                                                    </button>
                                                )}
                                                <Link href={`/admin/orders/${order.id}`} className="p-1.5 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-[4px] transition-all" title="View detail">
                                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                    {expanded === order.id && (
                                        <tr key={`${order.id}-exp`}>
                                            <td colSpan={8} className="px-5 py-3 bg-zinc-50/70 dark:bg-zinc-800/40 border-b border-slate-100 dark:border-zinc-800">
                                                <div className="rounded-[4px] border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                                                    {order.orderItems?.map((item, i) => (
                                                        <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 dark:border-zinc-800/60 last:border-0 bg-white dark:bg-[#121215]">
                                                            <div className="size-9 rounded-[4px] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                                                                {item.product?.images?.[0] && <Image src={item.product.images[0]} alt="" width={36} height={36} className="object-cover w-full h-full" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{item.product?.name}</p>
                                                                <p className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                                                                    <span>Qty: {item.quantity}</span>
                                                                    {item.color && (
                                                                        <span className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-300 font-medium">
                                                                            <span className="w-2 h-2 rounded-full border border-zinc-200" style={{ backgroundColor: getColorHex(item.color) }} />
                                                                            <span>{item.color}</span>
                                                                        </span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <p className="text-xs font-bold text-zinc-900 dark:text-white">{currency}{item.price}</p>
                                                        </div>
                                                    ))}
                                                    <div className="bg-zinc-50 dark:bg-zinc-800/60 px-4 py-3 flex flex-col gap-2 text-xs">
                                                        <div className="flex justify-between items-start">
                                                            <div className="text-zinc-600 dark:text-zinc-300 flex flex-col gap-0.5">
                                                                <p><span className="font-semibold text-zinc-800 dark:text-white">Ship to:</span> {order.address?.name || "Unknown"} <span className="font-mono ml-2">{order.address?.phone || ""}</span> {order.address?.emergencyContact ? <span className="text-amber-600 dark:text-amber-400 ml-1">(Alt: {order.address.emergencyContact})</span> : ""}</p>
                                                                <p className="mt-0.5">{order.address?.street || ""}{order.address?.landmark ? <span className="ml-1 font-semibold text-emerald-600 dark:text-emerald-400">({order.address.landmark})</span> : ""}</p>
                                                                <p>{order.address?.city || ""}{order.address?.country ? `, ${order.address.country}` : ""}</p>
                                                            </div>
                                                            <span className="text-xs font-bold text-zinc-900 dark:text-white">Total: {currency}{order.total?.toFixed(2)}</span>
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
                <div className="px-5 py-3.5 border-t border-zinc-200 dark:border-zinc-800">
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
