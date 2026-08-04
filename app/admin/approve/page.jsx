'use client'
import { useEffect, useState } from "react"
import Image from "next/image"
import { storesDummyData } from "@/assets/assets"
import { format } from "date-fns"
import toast from "react-hot-toast"

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

    if (loading) return <div className="p-8 flex items-center gap-3 text-zinc-400 dark:text-zinc-500 text-sm"><span className="material-symbols-outlined animate-spin text-emerald-500">progress_activity</span>Loading applications…</div>

    return (
        <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Store Approvals</h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{stores.length} store{stores.length !== 1 ? "s" : ""} pending approval</p>
                </div>
                {stores.length > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 text-xs font-bold">
                        <span className="material-symbols-outlined text-xs">pending</span>
                        {stores.length} Awaiting Review
                    </div>
                )}
            </div>

            {/* Empty State */}
            {stores.length === 0 && (
                <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-12 shadow-xs flex flex-col items-center gap-3 text-center">
                    <div className="size-12 rounded-[4px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">check_circle</span>
                    </div>
                    <div>
                        <p className="font-bold text-sm text-zinc-900 dark:text-white">All caught up!</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">No stores are pending approval at this time.</p>
                    </div>
                </div>
            )}

            {/* Pending Store Cards */}
            <div className="space-y-4">
                {stores.map(store => (
                    <div key={store.id} className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-5 shadow-xs relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                            PENDING REVIEW
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="size-14 rounded-[4px] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700">
                                <Image src={store.logo} alt={store.name} width={56} height={56} className="object-cover w-full h-full" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-base font-bold text-zinc-900 dark:text-white">{store.name}</h3>
                                    <span className="text-xs text-zinc-400">@{store.username}</span>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">{store.description}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 text-xs">
                                    <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/40 rounded-[4px] p-2.5">
                                        <span className="material-symbols-outlined text-xs text-zinc-400">location_on</span>
                                        <span className="text-zinc-600 dark:text-zinc-300 truncate">{store.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/40 rounded-[4px] p-2.5">
                                        <span className="material-symbols-outlined text-xs text-zinc-400">mail</span>
                                        <span className="text-zinc-600 dark:text-zinc-300 truncate">{store.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/40 rounded-[4px] p-2.5">
                                        <span className="material-symbols-outlined text-xs text-zinc-400">phone</span>
                                        <span className="text-zinc-600 dark:text-zinc-300">{store.contact}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2.5 mt-3 p-2 bg-zinc-50 dark:bg-zinc-800/40 rounded-[4px] w-fit">
                                    <Image src={store.user.image} alt={store.user.name} width={28} height={28} className="size-7 rounded-full object-cover" />
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{store.user.name}</p>
                                        <p className="text-[10px] text-zinc-400">{store.user.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800">
                            <button onClick={() => handleAction(store.id, "reject")}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-all rounded-[4px] font-semibold text-xs">
                                <span className="material-symbols-outlined text-sm">cancel</span>
                                Reject
                            </button>
                            <button onClick={() => handleAction(store.id, "approve")}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 dark:bg-emerald-500 text-white dark:text-slate-950 hover:bg-zinc-800 dark:hover:bg-emerald-400 transition-all rounded-[4px] font-semibold text-xs shadow-xs">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Approve Store
                            </button>
                            <span className="text-[11px] text-zinc-400 ml-auto">Submitted {format(new Date(store.createdAt), "MMM d, yyyy")}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}