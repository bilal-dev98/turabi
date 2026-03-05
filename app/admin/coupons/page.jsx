'use client'
import { useEffect, useState } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { couponDummyData } from "@/assets/assets"
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
            const res = await fetch('/api/admin/coupons');
            const data = await res.json();
            if (data.success) {
                setCoupons(data.data);
            } else {
                toast.error(data.message || "Failed to load coupons");
            }
        } catch (error) {
            toast.error("Error connecting to server");
        }
    }

    const handleAddCoupon = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCoupon)
            });
            const data = await res.json();

            if (data.success) {
                fetchCoupons(); // Reload list
                setNewCoupon({
                    code: '',
                    description: '',
                    discount: '',
                    forNewUser: false,
                    forMember: false,
                    isPublic: false,
                    expiresAt: new Date()
                });
                return data.message;
            } else {
                throw new Error(data.message || "Failed to create coupon");
            }
        } catch (error) {
            throw new Error(error.message || "Connection error");
        }
    }

    const handleChange = (e) => {
        setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value })
    }

    const deleteCoupon = async (code) => {
        try {
            const res = await fetch(`/api/admin/coupons/${code}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Coupon deleted!");
                fetchCoupons();
            } else {
                toast.error(data.message || "Failed to delete coupon");
            }
        } catch (error) {
            toast.error("Connection error while deleting");
        } finally {
            setDeleteTarget(null);
        }
    }

    useEffect(() => {
        fetchCoupons();
    }, [])

    return (
        <div className="p-10 max-w-7xl mx-auto w-full space-y-10 font-display">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl tracking-tight text-slate-800 font-bold drop-shadow-sm">Coupons <span className="text-slate-400 font-medium">Management</span></h1>
            </div>

            {/* Add Coupon */}
            <form onSubmit={(e) => toast.promise(handleAddCoupon(e), { loading: "Adding coupon..." })} className="bg-white rounded-2xl p-8 shadow-sm shadow-primary/5 border border-primary/5 text-sm max-w-2xl">
                <h2 className="text-2xl tracking-tight text-slate-800 font-bold drop-shadow-sm mb-6">Add <span className="text-slate-400 font-medium">Coupons</span></h2>
                <div className="flex gap-2 max-sm:flex-col mt-2">
                    <input type="text" placeholder="Coupon Code" className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
                        name="code" value={newCoupon.code} onChange={handleChange} required
                    />
                    <input type="number" placeholder="Coupon Discount (%)" min={1} max={100} className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
                        name="discount" value={newCoupon.discount} onChange={handleChange} required
                    />
                </div>
                <input type="text" placeholder="Coupon Description" className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
                    name="description" value={newCoupon.description} onChange={handleChange} required
                />

                <label>
                    <p className="mt-3">Coupon Expiry Date</p>
                    <input type="date" placeholder="Coupon Expires At" className="w-full mt-1 p-2 border border-slate-200 outline-slate-400 rounded-md"
                        name="expiresAt" value={newCoupon.expiresAt ? format(new Date(newCoupon.expiresAt), 'yyyy-MM-dd') : ''} onChange={handleChange}
                    />
                </label>

                <div className="mt-5">
                    <div className="flex gap-2 mt-3">
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                            <input type="checkbox" className="sr-only peer"
                                name="forNewUser" checked={newCoupon.forNewUser}
                                onChange={(e) => setNewCoupon({ ...newCoupon, forNewUser: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                            <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                        </label>
                        <p>For New User</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                            <input type="checkbox" className="sr-only peer"
                                name="forMember" checked={newCoupon.forMember}
                                onChange={(e) => setNewCoupon({ ...newCoupon, forMember: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                            <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                        </label>
                        <p>For Member</p>
                    </div>
                </div>
                <button className="mt-4 p-2 px-10 rounded bg-slate-700 text-white active:scale-95 transition">Add Coupon</button>
            </form>

            {/* List Coupons */}
            <div className="bg-white rounded-2xl p-8 shadow-sm shadow-primary/5 border border-primary/5">
                <h2 className="text-2xl tracking-tight text-slate-800 font-bold drop-shadow-sm mb-6">List <span className="text-slate-400 font-medium">Coupons</span></h2>
                <div className="overflow-x-auto rounded-xl border border-primary/5">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Code</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Description</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Discount</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Expires At</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Status</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">New User</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">For Member</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {coupons.map((coupon) => (
                                <tr key={coupon.code} className="hover:bg-slate-50">
                                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{coupon.code}</td>
                                    <td className="py-3 px-4 text-slate-800">{coupon.description}</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                                            <span className="material-symbols-outlined text-xs">sell</span>
                                            {coupon.discount}% OFF
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-600 text-sm">{format(new Date(coupon.expiresAt), 'yyyy-MM-dd')}</td>
                                    <td className="py-3 px-4">
                                        {new Date(coupon.expiresAt) < new Date() ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-500 rounded-full text-[11px] font-bold">
                                                <span className="material-symbols-outlined text-xs">cancel</span>Expired
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[11px] font-bold">
                                                <span className="material-symbols-outlined text-xs">check_circle</span>Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-slate-600 text-sm">{coupon.forNewUser ? 'Yes' : 'No'}</td>
                                    <td className="py-3 px-4 text-slate-600 text-sm">{coupon.forMember ? 'Yes' : 'No'}</td>
                                    <td className="py-3 px-4">
                                        <button onClick={() => setDeleteTarget(coupon.code)}
                                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
        </div>
    )
}