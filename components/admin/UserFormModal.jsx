'use client'
import { useState } from "react"
import toast from "react-hot-toast"

export default function UserFormModal({ isOpen, onClose, user, onSuccess }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role || "customer",
    })

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const url = user ? `/api/admin/users/${user.id}` : "/api/admin/users"
            const method = user ? "PATCH" : "POST"
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if (data.success) {
                toast.success(data.message)
                onSuccess()
                onClose()
            } else {
                toast.error(data.message)
            }
        } catch {
            toast.error("Failed to save user")
        } finally {
            setLoading(false)
        }
    }

    const inputCls = "w-full px-3.5 py-2.5 rounded-[4px] border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 focus:border-slate-400 dark:focus:border-emerald-600 transition-all"
    const labelCls = "block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
            <div
                className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-150"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="h-13 px-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-[4px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                            <span className="material-symbols-outlined text-base">{user ? "edit" : "person_add"}</span>
                        </div>
                        <h2 className="text-sm font-bold text-zinc-900 dark:text-white">{user ? "Edit User" : "Add New User"}</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[4px] transition-colors">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className={labelCls}>Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={inputCls}
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={inputCls}
                            placeholder="e.g. john@example.com"
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className={inputCls}
                        >
                            <option value="customer">Customer</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-2.5 justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-[4px] transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 rounded-[4px] transition-all shadow-xs ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Saving…" : user ? "Save Changes" : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
