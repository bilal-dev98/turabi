'use client'
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { getColorHex } from "@/lib/colors"

const STATUS_CONFIG = {
    ORDER_PLACED: { label: "Order Placed", cls: "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300", icon: "receipt", step: 0 },
    PROCESSING: { label: "Processing", cls: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300", icon: "sync", step: 1 },
    SHIPPED: { label: "Shipped", cls: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300", icon: "local_shipping", step: 2 },
    DELIVERED: { label: "Delivered", cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300", icon: "check_circle", step: 3 },
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
        setOrder(o => ({ ...o, status }))
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
                setOrder(o => ({ ...o, status: prev }))
                toast.error(data.message || "Failed to update")
            }
        } catch {
            setOrder(o => ({ ...o, status: prev }))
            toast.error("Error updating status")
        }
    }

    if (loading) return <div className="p-8 flex items-center gap-3 text-slate-400 dark:text-slate-500 text-sm"><span className="material-symbols-outlined animate-spin text-emerald-500">progress_activity</span>Loading order details…</div>
    if (!order) return (
        <div className="p-12 flex flex-col items-center gap-3 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">receipt_long</span>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">This order could not be found.</p>
            <Link href="/admin/orders" className="text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Orders
            </Link>
        </div>
    )

    const cfg = STATUS_CONFIG[order.status]
    const curStep = cfg?.step ?? 0

    return (
        <div className="p-5 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-5">
            {/* Back + header */}
            <div className="flex items-center gap-3 flex-wrap">
                <Link href="/admin/orders" className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[4px] transition-colors text-slate-400 dark:text-slate-500">
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                </Link>
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                        Order <span className="font-mono text-emerald-600 dark:text-emerald-400">#{(order.trackingId || order.id.slice(-8)).toUpperCase()}</span>
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {order.createdAt ? format(new Date(order.createdAt), "MMMM d, yyyy · h:mm a") : ""}
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-2 flex-wrap">
                    <select value={order.status} onChange={e => changeStatus(e.target.value)}
                        className="text-xs border border-slate-300 dark:border-slate-700 rounded-[4px] px-3 py-1.5 text-slate-800 dark:text-slate-200 outline-none bg-white dark:bg-slate-800 font-semibold">
                        {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                        ))}
                    </select>
                    <button type="button" onClick={() => window.print()}
                        className="flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-[4px] text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <span className="material-symbols-outlined text-sm">print</span>
                        Print
                    </button>
                </div>
            </div>

            {/* Status timeline */}
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[4px] p-5 shadow-xs">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 right-0 top-3.5 h-0.5 bg-slate-100 dark:bg-slate-800 mx-8" />
                    <div className="absolute left-0 top-3.5 h-0.5 bg-emerald-500 mx-8 transition-all duration-500"
                        style={{ width: curStep >= 0 ? `${(curStep / 3) * 80}%` : "0%" }} />
                    {TIMELINE_STEPS.map((s, i) => {
                        const done = curStep >= i
                        const c = STATUS_CONFIG[s]
                        return (
                            <div key={s} className="flex flex-col items-center gap-1.5 z-10">
                                <div className={`size-7 rounded-full flex items-center justify-center transition-all ${done ? "bg-emerald-500 text-slate-950 font-bold shadow-xs" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600"}`}>
                                    <span className="material-symbols-outlined text-xs">{c.icon}</span>
                                </div>
                                <span className={`text-[10px] font-bold text-center ${done ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-600"}`}>{c.label}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Order items */}
                <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-xs overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800">
                        <h2 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Order Items ({order.orderItems?.length})</h2>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {order.orderItems?.map((item, i) => (
                            <div key={i} className="flex items-center gap-3.5 px-5 py-3.5">
                                <div className="size-12 rounded-[4px] overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                                    {item.product?.images?.[0] ? (
                                        <Image src={item.product.images[0]} alt={item.product.name || ''} width={48} height={48} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-sm">image_not_supported</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-xs text-slate-900 dark:text-white truncate">{item.product?.name || "Unknown Product"}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{item.product?.category}</p>
                                    <div className="flex items-center gap-2 text-[11px] mt-1">
                                        <p className="text-slate-500 dark:text-slate-400">Qty: <span className="font-bold text-slate-800 dark:text-slate-200">{item.quantity}</span></p>
                                        {item.color && (
                                            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                                <span className="w-2 h-2 rounded-full border border-slate-200" style={{ backgroundColor: getColorHex(item.color) }} />
                                                <span className="font-medium text-slate-600 dark:text-slate-300 text-[10px]">{item.color}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-bold text-xs text-slate-900 dark:text-white">{currency} {(item.price * item.quantity).toFixed(0)}</p>
                                    <p className="text-[10px] text-slate-400">{currency} {item.price} each</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Totals */}
                    <div className="border-t border-slate-200 dark:border-slate-800 px-5 py-3.5 space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Subtotal</span><span>{currency} {order.total?.toFixed(0)}</span></div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Shipping</span><span className="text-emerald-600 dark:text-emerald-400 font-semibold">Free</span></div>
                        {order.isCouponUsed && (
                            <div className="flex justify-between text-emerald-600 dark:text-emerald-400"><span>Coupon Applied</span><span className="font-semibold">✓</span></div>
                        )}
                        <div className="flex justify-between font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 pt-2">
                            <span>Total</span>
                            <span>{currency} {order.total?.toFixed(0)}</span>
                        </div>
                    </div>
                </div>

                {/* Right panel */}
                <div className="space-y-4">
                    {/* Customer */}
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-xs">
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">Customer</h3>
                        <div className="flex items-center gap-2.5">
                            {order.user?.image && order.user.image.startsWith('http') ? (
                                <Image src={order.user.image} alt="" width={36} height={36} className="size-9 rounded-full object-cover" />
                            ) : (
                                <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">
                                    {order.user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-xs text-slate-900 dark:text-white">{order.user?.name || "Unknown"}</p>
                                <p className="text-[11px] text-slate-400">{order.user?.email || "—"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-xs">
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">Shipping Address</h3>
                        {order.address ? (
                            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
                                <p className="font-semibold text-slate-900 dark:text-white">{order.address.name}</p>
                                <p className="text-slate-500 dark:text-slate-400">{order.address.street}</p>
                                {order.address.landmark && (
                                    <p className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">({order.address.landmark})</p>
                                )}
                                <p className="text-slate-500 dark:text-slate-400">{order.address.city}{order.address.country ? `, ${order.address.country}` : ''}</p>
                                {order.address.phone && (
                                    <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-1">
                                        <span className="material-symbols-outlined text-xs">phone</span>
                                        {order.address.phone}
                                    </p>
                                )}
                                {order.address.emergencyContact && (
                                    <p className="text-amber-600 dark:text-amber-400 text-[11px]">Alt: {order.address.emergencyContact}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400">No address provided</p>
                        )}
                    </div>

                    {/* Payment */}
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-xs">
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">Payment</h3>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-700 dark:text-slate-300">{order.paymentMethod || "Cash on Delivery"}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] ${order.isPaid ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"}`}>
                                {order.isPaid ? "Paid" : "Pending"}
                            </span>
                        </div>
                        {order.paymentAccount && (
                            <p className="text-[11px] text-slate-400 mt-1.5">{order.paymentAccount}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
