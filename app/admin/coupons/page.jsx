'use client'
import { useEffect, useState } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal"

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([])
    const [deleteTarget, setDeleteTarget] = useState(null)

    const [newCoupon, setNewCoupon] = useState({
        code: '',
        description: '',
        discount: '',
        forNewUser: false,
        forMember: false,
        isPublic: false,
        expiresAt: new Date()
    })

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/admin/coupons')
            const data = await res.json()
            if (data.success) {
                setCoupons(data.data)
            } else {
                toast.error(data.message || "Failed to load coupons")
            }
        } catch (error) {
            toast.error("Error connecting to server")
        }
    }

    const handleAddCoupon = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCoupon)
            })
            const data = await res.json()

            if (data.success) {
                fetchCoupons()
                setNewCoupon({
                    code: '',
                    description: '',
                    discount: '',
                    forNewUser: false,
                    forMember: false,
                    isPublic: false,
                    expiresAt: new Date()
                })
                return data.message
            } else {
                throw new Error(data.message || "Failed to create coupon")
            }
        } catch (error) {
            throw new Error(error.message || "Connection error")
        }
    }

    const handleChange = (e) => {
        setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value })
    }

    const deleteCoupon = async (code) => {
        try {
            const res = await fetch(`/api/admin/coupons/${code}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Coupon deleted!")
                fetchCoupons()
            } else {
                toast.error(data.message || "Failed to delete coupon")
            }
        } catch (error) {
            toast.error("Connection error while deleting")
        } finally {
            setDeleteTarget(null)
        }
    }

    useEffect(() => {
        fetchCoupons()
    }, [])

    const inputCls = "w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all"
    const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1"

    return (
        <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Coupons</h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Manage promotional discount codes and special member offers.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Add Coupon Form */}
                <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-5 shadow-xs flex flex-col gap-4 h-fit">
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Add New Coupon</h2>
                    <form onSubmit={(e) => toast.promise(handleAddCoupon(e), { loading: "Adding coupon..." })} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelCls}>Coupon Code</label>
                                <input type="text" placeholder="e.g. SAVE20" className={`${inputCls} font-mono`}
                                    name="code" value={newCoupon.code} onChange={handleChange} required
                                />
                            </div>
                            <div>
                                <label className={labelCls}>Discount (%)</label>
                                <input type="number" placeholder="20" min={1} max={100} className={inputCls}
                                    name="discount" value={newCoupon.discount} onChange={handleChange} required
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelCls}>Description</label>
                            <input type="text" placeholder="e.g. 20% off first purchase" className={inputCls}
                                name="description" value={newCoupon.description} onChange={handleChange} required
                            />
                        </div>

                        <div>
                            <label className={labelCls}>Expiry Date</label>
                            <input type="date" className={inputCls}
                                name="expiresAt" value={newCoupon.expiresAt ? format(new Date(newCoupon.expiresAt), 'yyyy-MM-dd') : ''} onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2 pt-1">
                            <label className="flex items-center gap-3 cursor-pointer text-xs text-zinc-700 dark:text-zinc-300">
                                <input type="checkbox" className="size-4 rounded accent-emerald-500"
                                    name="forNewUser" checked={newCoupon.forNewUser}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, forNewUser: e.target.checked })}
                                />
                                <span>For New Users Only</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer text-xs text-zinc-700 dark:text-zinc-300">
                                <input type="checkbox" className="size-4 rounded accent-emerald-500"
                                    name="forMember" checked={newCoupon.forMember}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, forMember: e.target.checked })}
                                />
                                <span>For Registered Members Only</span>
                            </label>
                        </div>

                        <button className="w-full bg-zinc-900 dark:bg-emerald-500 text-white dark:text-slate-950 py-2 rounded-[4px] font-semibold text-xs shadow-xs hover:bg-zinc-800 dark:hover:bg-emerald-400 transition-all flex items-center justify-center gap-1.5 mt-2">
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add Coupon
                        </button>
                    </form>
                </div>

                {/* List Coupons */}
                <div className="lg:col-span-2 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                        <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Active Coupons ({coupons.length})</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[650px]">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                                <tr>
                                    {["Code", "Description", "Discount", "Expires", "Status", "Target", "Action"].map(h => (
                                        <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {coupons.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-12 text-center text-zinc-400 dark:text-zinc-600 text-xs">No coupons created yet.</td>
                                    </tr>
                                ) : (
                                    coupons.map((coupon) => {
                                        const isExpired = new Date(coupon.expiresAt) < new Date()
                                        return (
                                            <tr key={coupon.code} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors">
                                                <td className="px-4 py-3 font-mono font-bold text-xs text-zinc-900 dark:text-emerald-400">{coupon.code}</td>
                                                <td className="px-4 py-3 text-xs text-zinc-600 dark:text-zinc-300 truncate max-w-[150px]">{coupon.description}</td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-[4px] text-[10px] font-bold">
                                                        {coupon.discount}% OFF
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{format(new Date(coupon.expiresAt), 'MMM d, yyyy')}</td>
                                                <td className="px-4 py-3">
                                                    {isExpired ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 rounded-[4px] text-[10px] font-bold">
                                                            Expired
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-[4px] text-[10px] font-bold">
                                                            Active
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                                                    {coupon.forNewUser ? 'New Users' : coupon.forMember ? 'Members' : 'All'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button onClick={() => setDeleteTarget(coupon.code)}
                                                        className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-[4px] transition-all" title="Delete Coupon">
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <DeleteConfirmModal
                open={!!deleteTarget}
                title={`Delete Coupon ${deleteTarget}?`}
                description="This action cannot be undone. Any active carts using this coupon will lose the discount."
                confirmLabel="Delete Coupon"
                danger={true}
                onConfirm={() => deleteCoupon(deleteTarget)}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    )
}