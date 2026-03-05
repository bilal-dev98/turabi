'use client'
import { useEffect, useState } from "react"
import Image from "next/image"
import { storesDummyData } from "@/assets/assets"
import { format } from "date-fns"
import toast from "react-hot-toast"

// Add some pending stores for the approve page
const PENDING_STORES = [
    {
        id: "pending_1",
        name: "TechZone PK",
        username: "techzonepk",
        description: "Pakistan's premier tech accessories store offering the best gadgets, phone cases, cables, and tech gear at unbeatable prices.",
        address: "Shop 12, Main Market, Gulberg III, Lahore, Pakistan",
        status: "pending",
        isActive: false,
        email: "info@techzonepk.com",
        contact: "+92 300 1234567",
        logo: storesDummyData[0].logo,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        user: { id: "u_new1", name: "Umar Hassan", email: "umar@techzonepk.com", image: storesDummyData[0].user.image }
    },
    {
        id: "pending_2",
        name: "Organic Bliss",
        username: "organicbliss",
        description: "We sell 100% organic, natural and handmade skincare and wellness products sourced directly from local farms.",
        address: "Block C, Phase 6, DHA, Karachi, Pakistan",
        status: "pending",
        isActive: false,
        email: "hello@organicbliss.pk",
        contact: "+92 321 9876543",
        logo: storesDummyData[1].logo,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        user: { id: "u_new2", name: "Sara Khan", email: "sara@organicbliss.pk", image: storesDummyData[1].user.image }
    }
]

export default function AdminApprove() {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Show only pending stores in this page
        setStores(PENDING_STORES)
        setLoading(false)
    }, [])

    const handleAction = (id, action) => {
        const store = stores.find(s => s.id === id)
        toast.promise(
            new Promise(res => setTimeout(() => {
                setStores(prev => prev.filter(s => s.id !== id))
                res()
            }, 500)),
            {
                loading: action === "approve" ? "Approving..." : "Rejecting...",
                success: action === "approve" ? `${store.name} has been approved!` : `${store.name} has been rejected.`,
                error: "Something went wrong"
            }
        )
    }

    if (loading) return <div className="p-10 text-slate-400">Loading...</div>

    return (
        <div className="p-10 max-w-7xl mx-auto w-full space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Approve <span className="text-slate-400 font-medium">Stores</span></h1>
                    <p className="text-sm text-slate-500 mt-1">{stores.length} store{stores.length !== 1 ? "s" : ""} pending approval</p>
                </div>
                {stores.length > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-600 text-xs font-bold">
                        <span className="material-symbols-outlined text-sm">pending</span>
                        {stores.length} Awaiting Review
                    </div>
                )}
            </div>

            {/* Empty State */}
            {stores.length === 0 && (
                <div className="bg-white rounded-2xl p-16 shadow-sm shadow-primary/5 border border-primary/5 flex flex-col items-center gap-4">
                    <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-slate-900">All caught up!</p>
                        <p className="text-sm text-slate-500 mt-1">No stores are pending approval at this time.</p>
                    </div>
                </div>
            )}

            {/* Pending Store Cards */}
            <div className="space-y-6">
                {stores.map(store => (
                    <div key={store.id} className="bg-white rounded-2xl p-6 shadow-sm shadow-primary/5 border border-amber-200/60 overflow-hidden relative">
                        {/* Pending ribbon */}
                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                            PENDING REVIEW
                        </div>

                        <div className="flex items-start gap-5">
                            {/* Logo */}
                            <div className="size-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                <Image src={store.logo} alt={store.name} width={64} height={64} className="object-cover w-full h-full" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="text-lg font-bold text-slate-900">{store.name}</h3>
                                    <span className="text-sm text-slate-400">@{store.username}</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-2 max-w-2xl">{store.description}</p>

                                {/* Contact info */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3">
                                        <span className="material-symbols-outlined text-sm text-slate-500">location_on</span>
                                        <span className="text-xs text-slate-600 line-clamp-2">{store.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3">
                                        <span className="material-symbols-outlined text-sm text-slate-500">mail</span>
                                        <span className="text-xs text-slate-600">{store.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3">
                                        <span className="material-symbols-outlined text-sm text-slate-500">phone</span>
                                        <span className="text-xs text-slate-600">{store.contact}</span>
                                    </div>
                                </div>

                                {/* Owner */}
                                <div className="flex items-center gap-3 mt-4 p-3 bg-slate-50 rounded-xl w-fit">
                                    <Image src={store.user.image} alt={store.user.name} width={32} height={32} className="size-8 rounded-full object-cover" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{store.user.name}</p>
                                        <p className="text-xs text-slate-500">{store.user.email}</p>
                                    </div>
                                    <div className="border-l border-slate-200 pl-3 ml-1">
                                        <p className="text-xs text-slate-400">Applied {format(new Date(store.createdAt), "MMM d, yyyy")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                            <button onClick={() => handleAction(store.id, "reject")}
                                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-500 hover:bg-red-100 transition-all rounded-xl font-semibold text-sm">
                                <span className="material-symbols-outlined text-sm">cancel</span>
                                Reject Store
                            </button>
                            <button onClick={() => handleAction(store.id, "approve")}
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-primary/90 transition-all rounded-xl font-semibold text-sm shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Approve Store
                            </button>
                            <span className="text-xs text-slate-400 ml-auto">Submitted {format(new Date(store.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}