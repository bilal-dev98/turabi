'use client'
import PageTitle from "@/components/PageTitle";
import { PackageSearch, Clock, PackageCheck, Truck, CheckCircle2, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function TrackOrder() {
    const [trackingId, setTrackingId] = useState("");
    const [orderInfo, setOrderInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTrackOrder = async (e) => {
        e.preventDefault();

        if (!trackingId.trim()) {
            toast.error("Please enter a Tracking ID");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/track-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trackingId: trackingId.trim() })
            });
            const data = await res.json();

            if (data.success) {
                setOrderInfo(data.order);
                toast.success("Order found!");
            } else {
                setOrderInfo(null);
                toast.error(data.message || "Order not found. Please check your tracking ID.");
            }
        } catch (error) {
            toast.error("An error occurred while tracking the order.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusIndex = (currentStatus) => {
        const statuses = ['ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
        return statuses.indexOf(currentStatus);
    };

    const StatusStep = ({ icon: Icon, title, date, description, isActive, isCompleted, isLast }) => {
        return (
            <div className="relative flex gap-6 pb-12 last:pb-0">
                {!isLast && (
                    <div className={`absolute left-[23px] top-12 bottom-0 w-[2px] ${isCompleted ? 'bg-green-500' : 'bg-slate-200'}`} />
                )}

                <div className="relative z-10 flex-shrink-0">
                    <div className={`size-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${isActive || isCompleted ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Icon size={20} className={isCompleted || isActive ? 'animate-pulse-slow' : ''} />
                    </div>
                </div>

                <div className="pt-2 flex-grow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4 mb-2">
                        <h3 className={`font-bold text-lg ${isActive || isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>{title}</h3>
                        {date && <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{date}</span>}
                    </div>
                    <p className={`text-sm ${isActive ? 'text-slate-600' : 'text-slate-400'}`}>{description}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
            <PageTitle title="Track Your Order" />

            <div className="max-w-3xl mx-auto space-y-8">
                {/* Search Header */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
                    <div className="inline-flex items-center justify-center size-16 bg-blue-50 text-blue-600 rounded-2xl mb-6">
                        <PackageSearch size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Track Your Order</h1>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">Enter your tracking ID below to get real-time status updates on your delivery.</p>

                    <form onSubmit={handleTrackOrder} className="max-w-md mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        </div>
                        <input
                            type="text"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                            placeholder="e.g. GC-A8F93BD"
                            className="w-full pl-12 pr-32 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all uppercase"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white px-6 rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
                        >
                            {loading ? 'Searching...' : 'Track'}
                        </button>
                    </form>
                </div>

                {/* Results Section */}
                {orderInfo && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500 fade-in">

                        {/* Status Summary Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div>
                                <p className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-1">Order Details</p>
                                <h2 className="text-2xl font-black text-slate-900">{orderInfo.trackingId}</h2>
                                <p className="text-sm text-slate-500 mt-2">Placed on {new Date(orderInfo.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div className="px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 min-w-[200px]">
                                <div className="size-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <Truck size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Status</p>
                                    <p className="font-bold text-slate-900 capitalize">{orderInfo.status.replace('_', ' ').toLowerCase()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Timeline Column */}
                            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-10">
                                <h3 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">Delivery Timeline</h3>

                                <div className="pl-2">
                                    <StatusStep
                                        icon={CheckCircle2}
                                        title="Order Placed"
                                        date={new Date(orderInfo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        description="We have successfully received your order."
                                        isActive={getStatusIndex(orderInfo.status) === 0}
                                        isCompleted={getStatusIndex(orderInfo.status) > 0}
                                    />
                                    <StatusStep
                                        icon={Clock}
                                        title="Processing"
                                        description="Your order is being prepared and packed for shipment."
                                        isActive={getStatusIndex(orderInfo.status) === 1}
                                        isCompleted={getStatusIndex(orderInfo.status) > 1}
                                    />
                                    <StatusStep
                                        icon={Truck}
                                        title="Shipped"
                                        description="Your package has been handed over to our delivery partner."
                                        isActive={getStatusIndex(orderInfo.status) === 2}
                                        isCompleted={getStatusIndex(orderInfo.status) > 2}
                                    />
                                    <StatusStep
                                        icon={PackageCheck}
                                        title="Delivered"
                                        description="The package has been delivered successfully to the destination."
                                        isActive={getStatusIndex(orderInfo.status) === 3}
                                        isCompleted={getStatusIndex(orderInfo.status) === 3}
                                        isLast={true}
                                    />
                                </div>
                            </div>

                            {/* Shipment Details Column */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col gap-8 h-fit">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Delivery Address</h3>
                                    <div className="text-sm text-slate-600 space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="font-bold text-slate-900 text-base">{orderInfo.address?.name}</p>
                                        <p>{orderInfo.address?.phone}</p>
                                        <p className="mt-2 text-slate-500 leading-relaxed">{orderInfo.address?.street}, {orderInfo.address?.landmark && orderInfo.address?.landmark + ', '} {orderInfo.address?.city}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3 flex items-center justify-between">
                                        <span>Items Summary</span>
                                        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{orderInfo.orderItems.length} Items</span>
                                    </h3>
                                    <div className="flex flex-col gap-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                        {orderInfo.orderItems.map((item, index) => (
                                            <div key={index} className="flex gap-4 items-center">
                                                <div className="size-14 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100 p-1">
                                                    <Image src={item.product?.images?.[0] || '/placeholder.png'} alt={item.product?.name} width={50} height={50} className="w-full h-full object-contain mix-blend-multiply" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-slate-900 truncate" title={item.product?.name}>{item.product?.name}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
