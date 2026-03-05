import { X } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"

export default function UserViewModal({ isOpen, onClose, userDetails }) {
    if (!isOpen || !userDetails) return null;

    // Grab latest address (if any)
    const latestAddress = userDetails.Address && userDetails.Address.length > 0 ? userDetails.Address[0] : null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden shadow-primary/10 border border-primary/10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined font-light">account_circle</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">User Details</h2>
                            <p className="text-xs text-slate-500 font-medium">Viewing deep information and order history</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">

                    {/* Top Row: Basic Info & Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

                        {/* Core User Info */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-start gap-4 h-full">
                            {userDetails.image ? (
                                <Image src={userDetails.image} alt={userDetails.name} width={64} height={64} className="size-16 rounded-2xl object-cover shadow-sm" />
                            ) : (
                                <div className="size-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-xl font-bold text-primary shadow-sm">
                                    {(userDetails.name || "U").charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xl font-bold text-slate-800">{userDetails.name}</h3>
                                <p className="text-sm text-slate-500 font-medium">{userDetails.email}</p>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold ${userDetails.role === "seller" ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-600"}`}>
                                        {userDetails.role}
                                    </span>
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold ${userDetails.isBanned ? "bg-red-100 text-red-500" : "bg-green-100 text-green-600"}`}>
                                        {userDetails.isBanned ? "Banned" : "Active"}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        Joined {format(new Date(userDetails.joinedAt), "PP")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery / Contact Info from Address */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-3 h-full">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-[#4799eb] text-[18px]">local_shipping</span>
                                Primary Delivery details
                            </h4>

                            {latestAddress ? (
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Full Name</span>
                                        <span className="font-medium text-slate-700">{latestAddress.name}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Contact No.</span>
                                        <span className="font-medium text-slate-700">{latestAddress.phone}</span>
                                    </div>
                                    <div className="flex flex-col col-span-2">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Street Address</span>
                                        <span className="font-medium text-slate-700">{latestAddress.street}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Landmark</span>
                                        <span className="font-medium text-slate-700 truncate">{latestAddress.landmark || 'N/A'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">City</span>
                                        <span className="font-medium text-slate-700">{latestAddress.city}</span>
                                    </div>
                                    <div className="flex flex-col col-span-2">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Emergency Contact</span>
                                        <span className="font-medium text-slate-700">{latestAddress.emergencyContact || 'N/A'}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-70">
                                    <span className="material-symbols-outlined text-3xl mb-2">location_off</span>
                                    <p className="text-sm font-medium">No address or checkout history found.</p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Order Summary */}
                    <div>
                        <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
                            Order History ({userDetails.buyerOrders?.length || 0})
                        </h4>

                        {userDetails.buyerOrders && userDetails.buyerOrders.length > 0 ? (
                            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                        <tr>
                                            <th className="px-5 py-3">Order ID</th>
                                            <th className="px-5 py-3">Date</th>
                                            <th className="px-5 py-3 w-[40%]">Items Summary</th>
                                            <th className="px-5 py-3">Total</th>
                                            <th className="px-5 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {userDetails.buyerOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-5 py-3 font-mono font-bold text-slate-700">
                                                    {order.trackingId}
                                                </td>
                                                <td className="px-5 py-3 text-slate-500">
                                                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                                                </td>
                                                <td className="px-5 py-3 text-slate-600 truncate max-w-[200px]">
                                                    {order.orderItems?.map(i => `${i.quantity}x ${i.product?.name}`).join(', ') || 'Unknown items'}
                                                </td>
                                                <td className="px-5 py-3 font-bold text-slate-900">
                                                    ${order.total.toFixed(2)}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] tracking-wider uppercase font-bold 
                                                        ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-600' :
                                                            order.status === 'ORDER_PLACED' ? 'bg-blue-100 text-blue-600' :
                                                                order.status === 'PROCESSING' ? 'bg-orange-100 text-orange-600' :
                                                                    'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {order.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="border border-slate-100 border-dashed rounded-2xl bg-slate-50 p-8 flex flex-col items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">shopping_cart_checkout</span>
                                <p className="text-sm font-medium">This user hasn't placed any orders yet.</p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button onClick={onClose} className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-colors text-sm">
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    )
} 
