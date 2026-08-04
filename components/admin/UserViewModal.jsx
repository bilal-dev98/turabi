'use client'
import { X } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"

export default function UserViewModal({ isOpen, onClose, userDetails }) {
    if (!isOpen || !userDetails) return null

    const latestAddress = userDetails.Address && userDetails.Address.length > 0 ? userDetails.Address[0] : null

    const statusColors = {
        DELIVERED: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
        ORDER_PLACED: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
        PROCESSING: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
        CANCELLED: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
            <div
                className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="h-14 px-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-[#121215] sticky top-0 z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-[4px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                            <span className="material-symbols-outlined text-base">account_circle</span>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">User Details</h2>
                            <p className="text-[10px] text-zinc-400 font-medium">Profile, address & order history</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[4px] transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar">

                    {/* Profile + Address row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Profile card */}
                        <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-[4px] p-5 border border-zinc-200 dark:border-zinc-700/60 flex items-start gap-4">
                            {userDetails.image ? (
                                <Image src={userDetails.image} alt={userDetails.name} width={56} height={56} className="size-14 rounded-[4px] object-cover shadow-xs shrink-0" />
                            ) : (
                                <div className="size-14 rounded-[4px] bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xl font-bold text-zinc-600 dark:text-zinc-300 shrink-0">
                                    {(userDetails.name || "U").charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex flex-col gap-1.5 min-w-0">
                                <h3 className="text-base font-bold text-zinc-900 dark:text-white truncate">{userDetails.name}</h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{userDetails.email}</p>
                                <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                    <span className={`inline-flex px-2 py-0.5 rounded-[4px] text-[10px] uppercase tracking-wider font-bold ${userDetails.role === "seller" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300" : "bg-zinc-100 text-zinc-600 dark:bg-slate-700 dark:text-zinc-300"}`}>
                                        {userDetails.role}
                                    </span>
                                    <span className={`inline-flex px-2 py-0.5 rounded-[4px] text-[10px] uppercase tracking-wider font-bold ${userDetails.isBanned ? "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"}`}>
                                        {userDetails.isBanned ? "Banned" : "Active"}
                                    </span>
                                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                                        Joined {format(new Date(userDetails.joinedAt), "PP")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Address card */}
                        <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-[4px] p-5 border border-zinc-200 dark:border-zinc-700/60 flex flex-col gap-3">
                            <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider">
                                <span className="material-symbols-outlined text-blue-500 text-sm">local_shipping</span>
                                Primary Delivery Details
                            </h4>
                            {latestAddress ? (
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                                    {[
                                        { label: "Full Name", value: latestAddress.name },
                                        { label: "Contact No.", value: latestAddress.phone },
                                        { label: "Street Address", value: latestAddress.street, full: true },
                                        { label: "Landmark", value: latestAddress.landmark || "N/A" },
                                        { label: "City", value: latestAddress.city },
                                        { label: "Emergency Contact", value: latestAddress.emergencyContact || "N/A", full: true },
                                    ].map(({ label, value, full }) => (
                                        <div key={label} className={`flex flex-col ${full ? "col-span-2" : ""}`}>
                                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mb-0.5">{label}</span>
                                            <span className="font-semibold text-zinc-700 dark:text-zinc-200 truncate">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 py-4 gap-1.5">
                                    <span className="material-symbols-outlined text-2xl">location_off</span>
                                    <p className="text-xs font-medium">No address or checkout history found.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order History */}
                    <div>
                        <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                            <span className="material-symbols-outlined text-zinc-400 text-sm">receipt_long</span>
                            Order History ({userDetails.buyerOrders?.length || 0})
                        </h4>
                        {userDetails.buyerOrders && userDetails.buyerOrders.length > 0 ? (
                            <div className="border border-zinc-200 dark:border-zinc-800 rounded-[4px] overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                                        <tr>
                                            {["Order ID", "Date", "Items", "Total", "Status"].map(h => (
                                                <th key={h} className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                        {userDetails.buyerOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                                <td className="px-4 py-2.5 font-mono text-xs font-bold text-zinc-700 dark:text-zinc-200">{order.trackingId}</td>
                                                <td className="px-4 py-2.5 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{format(new Date(order.createdAt), "MMM d, yyyy")}</td>
                                                <td className="px-4 py-2.5 text-xs text-zinc-600 dark:text-zinc-300 truncate max-w-[180px]">
                                                    {order.orderItems?.map(i => `${i.quantity}× ${i.product?.name}`).join(", ") || "Unknown items"}
                                                </td>
                                                <td className="px-4 py-2.5 text-xs font-bold text-zinc-900 dark:text-white">${order.total.toFixed(2)}</td>
                                                <td className="px-4 py-2.5">
                                                    <span className={`inline-flex px-2 py-0.5 rounded-[4px] text-[10px] tracking-wider uppercase font-bold ${statusColors[order.status] || "bg-zinc-100 text-zinc-600 dark:bg-slate-700 dark:text-zinc-300"}`}>
                                                        {order.status.replace(/_/g, " ")}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="border border-dashed border-slate-300 dark:border-zinc-700 rounded-[4px] bg-zinc-50 dark:bg-zinc-800/20 p-8 flex flex-col items-center text-zinc-400 dark:text-zinc-600 gap-2">
                                <span className="material-symbols-outlined text-3xl">shopping_cart_checkout</span>
                                <p className="text-xs font-medium">No orders placed yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/20 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-[4px] text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
