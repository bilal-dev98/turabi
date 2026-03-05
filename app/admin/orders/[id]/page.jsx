'use client'
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import toast from "react-hot-toast"

const STATUS_CONFIG = {
    ORDER_PLACED: { label: "Order Placed", cls: "bg-sky-100 text-sky-600", icon: "receipt", step: 0 },
    PROCESSING: { label: "Processing", cls: "bg-blue-100 text-blue-600", icon: "sync", step: 1 },
    SHIPPED: { label: "Shipped", cls: "bg-purple-100 text-purple-600", icon: "local_shipping", step: 2 },
    DELIVERED: { label: "Delivered", cls: "bg-primary/10 text-primary", icon: "check_circle", step: 3 },
}

const TIMELINE_STEPS = ["ORDER_PLACED", "PROCESSING", "SHIPPED", "DELIVERED"]

export default function OrderDetailPage() {
    const { id } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const currency = 'Rs'

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/admin/orders/${id}`)
                const data = await res.json()
                if (data.success) {
                    setOrder(data.data)
                } else {
                    setOrder(null)
                }
            } catch (error) {
                setOrder(null)
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [id])

    const changeStatus = async (status) => {
        const prev = order.status
        setOrder(o => ({ ...o, status })) // Optimistic update
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            const data = await res.json()
            if (data.success) {
                toast.success(`Status updated to ${STATUS_CONFIG[status]?.label || status}`)
            } else {
                setOrder(o => ({ ...o, status: prev })) // Revert
                toast.error(data.message || "Failed to update")
            }
        } catch {
            setOrder(o => ({ ...o, status: prev }))
            toast.error("Error updating status")
        }
    }

    if (loading) return <div className="p-10 text-slate-400">Loading order…</div>
    if (!order) return (
        <div className="p-10 flex flex-col items-center gap-4 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-200">receipt_long</span>
            <p className="text-slate-500 font-medium">This order could not be found.</p>
            <Link href="/admin/orders" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Orders
            </Link>
        </div>
    )

    const cfg = STATUS_CONFIG[order.status]
    const curStep = cfg?.step ?? 0

    return (
        <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-6">
            {/* Back + header */}
            <div className="flex items-center gap-4 flex-wrap">
                <Link href="/admin/orders" className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Order <span className="font-mono text-primary">{order.trackingId || order.id.slice(-8).toUpperCase()}</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        {order.createdAt ? format(new Date(order.createdAt), "MMMM d, yyyy · h:mm a") : ""}
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-2 flex-wrap">
                    <select value={order.status} onChange={e => changeStatus(e.target.value)}
                        className="text-sm border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 bg-white font-semibold">
                        {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                        ))}
                    </select>
                    <button type="button" onClick={() => window.print()}
                        className="flex items-center gap-2 border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
                        <span className="material-symbols-outlined text-sm">print</span>
                        Print
                    </button>
                </div>
            </div>

            {/* Status timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-sm shadow-primary/5 border border-primary/5">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 right-0 top-4 h-0.5 bg-slate-100 mx-10" />
                    <div className="absolute left-0 top-4 h-0.5 bg-primary mx-10 transition-all duration-500"
                        style={{ width: curStep >= 0 ? `${(curStep / 3) * 80}%` : "0%" }} />
                    {TIMELINE_STEPS.map((s, i) => {
                        const done = curStep >= i
                        const c = STATUS_CONFIG[s]
                        return (
                            <div key={s} className="flex flex-col items-center gap-2 z-10">
                                <div className={`size-8 rounded-full flex items-center justify-center transition-all ${done ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-slate-100 text-slate-400"}`}>
                                    <span className="material-symbols-outlined text-sm">{c.icon}</span>
                                </div>
                                <span className={`text-xs font-bold text-center ${done ? "text-primary" : "text-slate-400"}`}>{c.label}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order items */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm shadow-primary/5 border border-primary/5 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h2 className="font-bold text-slate-900">Order Items ({order.orderItems?.length})</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {order.orderItems?.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-4">
                                <div className="size-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                                    {item.product?.images?.[0] ? (
                                        <Image src={item.product.images[0]} alt={item.product.name || ''} width={64} height={64} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-slate-300">image_not_supported</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 truncate">{item.product?.name || "Unknown Product"}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{item.product?.category}</p>
                                    <p className="text-xs text-slate-500 mt-1">Qty: <span className="font-bold">{item.quantity}</span></p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-bold text-slate-900">{currency} {(item.price * item.quantity).toFixed(2)}</p>
                                    <p className="text-xs text-slate-400">{currency} {item.price} each</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Totals */}
                    <div className="border-t border-slate-100 px-6 py-4 space-y-2">
                        <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>{currency} {order.total?.toFixed(2)}</span></div>
                        <div className="flex justify-between text-sm text-slate-600"><span>Shipping</span><span className="text-primary font-semibold">Free</span></div>
                        {order.isCouponUsed && (
                            <div className="flex justify-between text-sm text-green-600"><span>Coupon Applied</span><span className="font-semibold">✓</span></div>
                        )}
                        <div className="flex justify-between font-bold text-slate-900 border-t border-slate-100 pt-2">
                            <span>Total</span>
                            <span>{currency} {order.total?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Right panel: Customer + Address + Payment */}
                <div className="space-y-4">
                    {/* Customer */}
                    <div className="bg-white rounded-2xl shadow-sm shadow-primary/5 border border-primary/5 p-5">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Customer</h3>
                        <div className="flex items-center gap-3">
                            {order.user?.image && order.user.image.startsWith('http') ? (
                                <Image src={order.user.image} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
                            ) : (
                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                    {order.user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-sm">{order.user?.name || "Unknown"}</p>
                                <p className="text-xs text-slate-400">{order.user?.email || "—"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-2xl shadow-sm shadow-primary/5 border border-primary/5 p-5">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Shipping Address</h3>
                        {order.address ? (
                            <div className="text-sm text-slate-700 space-y-1">
                                <p className="font-semibold">{order.address.name}</p>
                                <p className="text-slate-500">{order.address.street}</p>
                                {order.address.landmark && (
                                    <p className="text-primary text-xs font-medium">{order.address.landmark}</p>
                                )}
                                <p className="text-slate-500">{order.address.city}{order.address.country ? `, ${order.address.country}` : ''}</p>
                                {order.address.phone && (
                                    <p className="text-slate-500 flex items-center gap-1 pt-1">
                                        <span className="material-symbols-outlined text-sm">phone</span>
                                        {order.address.phone}
                                    </p>
                                )}
                                {order.address.emergencyContact && (
                                    <p className="text-amber-600 text-xs">Alt: {order.address.emergencyContact}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">No address provided</p>
                        )}
                    </div>

                    {/* Payment */}
                    <div className="bg-white rounded-2xl shadow-sm shadow-primary/5 border border-primary/5 p-5">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Payment</h3>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-700">{order.paymentMethod || "Cash on Delivery"}</span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${order.isPaid ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-600"}`}>
                                {order.isPaid ? "Paid" : "Pending"}
                            </span>
                        </div>
                        {order.paymentAccount && (
                            <p className="text-xs text-slate-400 mt-2">{order.paymentAccount}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
