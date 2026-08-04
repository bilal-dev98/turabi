'use client'
import { useEffect, useState } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"

const GRADIENTS = [
    { label: "Purple → Red (Default)", value: "linear-gradient(to right, #8b5cf6, #9938CA, #E0724A)", preview: "from-violet-500 to-orange-400" },
    { label: "Amber Warning", value: "linear-gradient(to right, #f59e0b, #d97706)", preview: "from-amber-400 to-amber-600" },
    { label: "Blue Info", value: "linear-gradient(to right, #3b82f6, #1d4ed8)", preview: "from-blue-400 to-blue-700" },
    { label: "Green Success", value: "linear-gradient(to right, #10b981, #059669)", preview: "from-emerald-400 to-emerald-600" },
    { label: "Teal Changelog", value: "linear-gradient(to right, #14b8a6, #0891b2)", preview: "from-teal-400 to-cyan-600" },
    { label: "Red Alert", value: "linear-gradient(to right, #ef4444, #b91c1c)", preview: "from-red-400 to-red-700" },
    { label: "Pink Sale", value: "linear-gradient(to right, #ec4899, #8b5cf6)", preview: "from-pink-400 to-violet-500" },
    { label: "Dark Premium", value: "linear-gradient(to right, #1e293b, #334155)", preview: "from-slate-800 to-slate-600" },
]

const TEMPLATES = [
    {
        icon: "🎉",
        label: "Discount Offer",
        data: {
            message: "🎉 Get 20% OFF on Your First Order! Use code NEW20",
            buttonLabel: "Claim Offer",
            buttonAction: "coupon",
            couponCode: "NEW20",
            gradient: "linear-gradient(to right, #8b5cf6, #9938CA, #E0724A)",
            textColor: "#ffffff"
        }
    },
    {
        icon: "⚠️",
        label: "Warning / Alert",
        data: {
            message: "⚠️ Scheduled maintenance on Sunday, March 9 from 2–4 AM. Expect brief downtime.",
            buttonLabel: "Learn More",
            buttonAction: "dismiss",
            gradient: "linear-gradient(to right, #f59e0b, #d97706)",
            textColor: "#1a1a1a"
        }
    },
    {
        icon: "📦",
        label: "New Products",
        data: {
            message: "📦 New arrivals are here! Explore our latest collection now.",
            buttonLabel: "Shop Now",
            buttonAction: "link",
            linkUrl: "/products",
            gradient: "linear-gradient(to right, #3b82f6, #1d4ed8)",
            textColor: "#ffffff"
        }
    },
    {
        icon: "🔄",
        label: "Changelog",
        data: {
            message: "🔄 v2.0 is live! New features: faster checkout, order tracking, and more.",
            buttonLabel: "See What's New",
            buttonAction: "link",
            linkUrl: "/changelog",
            gradient: "linear-gradient(to right, #14b8a6, #0891b2)",
            textColor: "#ffffff"
        }
    },
    {
        icon: "🚚",
        label: "Shipping Notice",
        data: {
            message: "🚚 Free delivery on all orders above Rs 2000! Limited time offer.",
            buttonLabel: "Shop Now",
            buttonAction: "link",
            linkUrl: "/products",
            gradient: "linear-gradient(to right, #10b981, #059669)",
            textColor: "#ffffff"
        }
    },
    {
        icon: "🛑",
        label: "Site Maintenance",
        data: {
            message: "🛑 Our site is undergoing maintenance. Some features may be temporarily unavailable.",
            buttonLabel: "Status Page",
            buttonAction: "link",
            linkUrl: "/status",
            gradient: "linear-gradient(to right, #ef4444, #b91c1c)",
            textColor: "#ffffff"
        }
    },
]

const EMPTY_FORM = {
    message: "",
    buttonLabel: "",
    buttonAction: "dismiss",
    couponCode: "",
    gradient: "linear-gradient(to right, #8b5cf6, #9938CA, #E0724A)",
    textColor: "#ffffff",
    autoActivate: true,
}

export default function AdminBanners() {
    const [banners, setBanners] = useState([])
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState(EMPTY_FORM)
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [tab, setTab] = useState("templates")
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)

    const fetchBanners = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/banners')
            const data = await res.json()
            if (data.success) setBanners(data.data)
        } catch (err) { toast.error("Failed to load banners") }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchBanners() }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleApplyTemplate = (tmpl) => {
        setForm({ ...EMPTY_FORM, ...tmpl.data })
        setTab("create")
        setEditingId(null)
    }

    const handleSave = async () => {
        if (!form.message.trim()) { toast.error("Message is required"); return }
        setSaving(true)
        try {
            const isEdit = !!editingId
            const url = isEdit ? `/api/admin/banners/${editingId}` : '/api/admin/banners'
            const method = isEdit ? 'PATCH' : 'POST'
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
            const data = await res.json()
            if (data.success) {
                toast.success(isEdit ? "Banner updated!" : "Banner created!")
                setForm(EMPTY_FORM)
                setEditingId(null)
                setTab("templates")
                fetchBanners()
            } else toast.error(data.message)
        } catch (err) { toast.error("Error saving banner") }
        finally { setSaving(false) }
    }

    const handleActivate = async (id, current) => {
        try {
            const res = await fetch(`/api/admin/banners/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !current })
            })
            const data = await res.json()
            if (data.success) {
                toast.success(current ? "Banner deactivated" : "Banner is now live! ✅")
                fetchBanners()
            }
        } catch (err) { toast.error("Error updating banner") }
    }

    const handleEdit = (banner) => {
        setForm({
            message: banner.message,
            buttonLabel: banner.buttonLabel || "",
            buttonAction: banner.buttonAction || "dismiss",
            couponCode: banner.couponCode || "",
            linkUrl: banner.linkUrl || "",
            gradient: banner.gradient,
            textColor: banner.textColor || "#ffffff",
            autoActivate: false,
        })
        setEditingId(banner.id)
        setTab("create")
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (data.success) { toast.success("Banner deleted"); setConfirmDeleteId(null); fetchBanners() }
            else toast.error(data.message || "Delete failed")
        } catch (err) { toast.error("Error deleting") }
    }

    if (loading) return <div className="p-8 flex items-center gap-3 text-zinc-400 dark:text-zinc-500 text-sm"><span className="material-symbols-outlined animate-spin text-emerald-500">progress_activity</span>Loading banners…</div>

    return (
        <div className="p-5 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    Announcement Banners
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Create and manage site-wide announcement banners shown at the top of your store.</p>
            </div>

            {/* System Warnings */}
            {!loading && banners.length > 0 && !banners.some(b => b.isActive) && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-[4px] p-4 flex gap-3 items-start shadow-xs">
                    <span className="text-xl">⚠️</span>
                    <div>
                        <h3 className="text-amber-800 dark:text-amber-300 font-bold text-xs">No Active Banner</h3>
                        <p className="text-amber-700 dark:text-amber-400 text-xs mt-0.5">Your store currently has no active announcements. The banner section will remain hidden on the store.</p>
                    </div>
                </div>
            )}

            {/* Live Preview */}
            {form.message && (
                <div className="rounded-[4px] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xs">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-1.5 border-b border-zinc-200 dark:border-zinc-800">Live Preview</p>
                    <div style={{ background: form.gradient }} className="px-5 py-2.5">
                        <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
                            <p style={{ color: form.textColor }} className="text-xs font-medium">{form.message}</p>
                            <div className="flex items-center gap-3 shrink-0">
                                {form.buttonLabel && (
                                    <button type="button" className="font-semibold text-zinc-900 bg-white px-3.5 py-1 rounded-full text-xs whitespace-nowrap shadow-xs">
                                        {form.buttonLabel}
                                    </button>
                                )}
                                <span style={{ color: form.textColor }} className="material-symbols-outlined text-xs cursor-pointer">close</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-[4px] w-fit">
                <button type="button" onClick={() => setTab("templates")} className={`px-3.5 py-1.5 rounded-[4px] text-xs font-semibold transition-all ${tab === "templates" ? "bg-white dark:bg-slate-700 shadow-xs text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"}`}>
                    📋 Templates
                </button>
                <button type="button" onClick={() => { setTab("create"); setEditingId(null); setForm(EMPTY_FORM) }} className={`px-3.5 py-1.5 rounded-[4px] text-xs font-semibold transition-all ${tab === "create" ? "bg-white dark:bg-slate-700 shadow-xs text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"}`}>
                    ✏️ {editingId ? "Edit Banner" : "Custom Banner"}
                </button>
            </div>

            {/* Templates Grid */}
            {tab === "templates" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {TEMPLATES.map((tmpl) => (
                        <button key={tmpl.label} type="button" onClick={() => handleApplyTemplate(tmpl)}
                            className="text-left bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all group">
                            <div className="size-9 rounded-[4px] flex items-center justify-center text-xl mb-2.5" style={{ background: tmpl.data.gradient }}>
                                {tmpl.icon}
                            </div>
                            <p className="font-bold text-zinc-900 dark:text-white text-xs">{tmpl.label}</p>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">{tmpl.data.message}</p>
                            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2.5 group-hover:underline">Use this template →</p>
                        </button>
                    ))}
                </div>
            )}

            {/* Create / Edit Form */}
            {tab === "create" && (
                <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] shadow-xs p-5 space-y-4">
                    <h2 className="font-bold text-sm text-zinc-900 dark:text-white">{editingId ? "Edit Banner" : "Create Custom Banner"}</h2>

                    {/* Message */}
                    <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Message *</span>
                        <textarea name="message" value={form.message} onChange={handleChange} rows={2}
                            className="mt-1 w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 resize-none transition-all"
                            placeholder="e.g. 🎉 Get 20% OFF with code NEW20" />
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Button Label */}
                        <label className="block">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Button Label</span>
                            <input type="text" name="buttonLabel" value={form.buttonLabel} onChange={handleChange}
                                className="mt-1 w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all"
                                placeholder="e.g. Claim Offer" />
                        </label>

                        {/* Button Action */}
                        <label className="block">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Button Action</span>
                            <select name="buttonAction" value={form.buttonAction} onChange={handleChange}
                                className="mt-1 w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all">
                                <option value="dismiss">Dismiss (close banner)</option>
                                <option value="coupon">Copy Coupon Code</option>
                                <option value="link">Navigate to Link</option>
                            </select>
                        </label>

                        {/* Coupon Code */}
                        {form.buttonAction === "coupon" && (
                            <label className="block">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Coupon Code</span>
                                <input type="text" name="couponCode" value={form.couponCode} onChange={handleChange}
                                    className="mt-1 w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 font-mono transition-all"
                                    placeholder="e.g. NEW20" />
                            </label>
                        )}

                        {/* Link URL */}
                        {form.buttonAction === "link" && (
                            <label className="block">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Link URL</span>
                                <input type="text" name="linkUrl" value={form.linkUrl} onChange={handleChange}
                                    className="mt-1 w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all"
                                    placeholder="e.g. /products" />
                            </label>
                        )}
                    </div>

                    {/* Gradient Picker */}
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1.5">Background Gradient</span>
                        <div className="flex flex-wrap gap-2">
                            {GRADIENTS.map(g => (
                                <button key={g.value} type="button" onClick={() => setForm(f => ({ ...f, gradient: g.value }))}
                                    title={g.label}
                                    className={`h-7 w-14 rounded-[4px] transition-all ${form.gradient === g.value ? 'ring-2 ring-offset-2 ring-emerald-500 scale-105' : 'hover:scale-105'}`}
                                    style={{ background: g.value }} />
                            ))}
                        </div>
                    </div>

                    {/* Text Color */}
                    <div className="flex items-center gap-3">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1">Text Color</span>
                            <div className="flex items-center gap-2">
                                <input type="color" name="textColor" value={form.textColor} onChange={handleChange}
                                    className="size-8 rounded-[4px] border border-slate-300 dark:border-zinc-700 cursor-pointer" />
                                <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300">{form.textColor}</span>
                            </div>
                        </div>
                    </div>

                    {!editingId && (
                        <label className="flex items-center gap-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 p-3 rounded-[4px] cursor-pointer">
                            <input
                                type="checkbox"
                                name="autoActivate"
                                checked={form.autoActivate}
                                onChange={handleChange}
                                className="size-4 rounded accent-emerald-500"
                            />
                            <div>
                                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">Activate immediately</span>
                                <span className="text-[11px] text-zinc-400 block">Replaces the currently active banner.</span>
                            </div>
                        </label>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2.5 pt-2">
                        <button type="button" onClick={handleSave} disabled={saving}
                            className="bg-zinc-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-semibold px-4 py-2 rounded-[4px] text-xs hover:bg-zinc-800 dark:hover:bg-emerald-400 transition-all shadow-xs disabled:opacity-50">
                            {saving ? "Saving…" : editingId ? "Update Banner" : "Create Banner"}
                        </button>
                        <button type="button" onClick={() => { setForm(EMPTY_FORM); setEditingId(null) }}
                            className="border border-slate-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold px-4 py-2 rounded-[4px] text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                            Reset
                        </button>
                    </div>
                </div>
            )}

            {/* Saved Banners */}
            <div className="space-y-3">
                <h2 className="font-bold text-sm text-zinc-900 dark:text-white">Saved Banners <span className="text-zinc-400 font-medium ml-1">({banners.length})</span></h2>
                {banners.length === 0 ? (
                    <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-8 text-center">
                        <span className="material-symbols-outlined text-3xl text-zinc-300 dark:text-zinc-600 mb-1 block">campaign</span>
                        <p className="text-zinc-400 text-xs">No banners yet. Pick a template above to get started!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {banners.map(banner => (
                            <div key={banner.id} className={`bg-white dark:bg-[#121215] rounded-[4px] border shadow-xs overflow-hidden ${banner.isActive ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'border-zinc-200 dark:border-zinc-800'}`}>
                                <div style={{ background: banner.gradient }} className="px-4 py-2">
                                    <p style={{ color: banner.textColor }} className="text-xs font-medium truncate">{banner.message}</p>
                                </div>
                                <div className="px-4 py-2.5 flex items-center gap-3 flex-wrap">
                                    {banner.isActive && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-[4px]">
                                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Live on Site
                                        </span>
                                    )}
                                    {banner.buttonLabel && (
                                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-[4px]">
                                            Button: {banner.buttonLabel}
                                        </span>
                                    )}
                                    <span className="text-[10px] text-zinc-400 ml-auto">
                                        {format(new Date(banner.createdAt), "MMM d, yyyy")}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {confirmDeleteId === banner.id ? (
                                            <div className="flex items-center gap-1">
                                                <span className="text-[10px] text-zinc-500">Delete?</span>
                                                <button type="button" onClick={() => handleDelete(banner.id)} className="text-[10px] font-bold px-2 py-1 rounded bg-rose-600 text-white">Yes</button>
                                                <button type="button" onClick={() => setConfirmDeleteId(null)} className="text-[10px] font-bold px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">No</button>
                                            </div>
                                        ) : (
                                            <>
                                                <button type="button" onClick={() => handleActivate(banner.id, banner.isActive)}
                                                    className={`text-[10px] font-bold px-2.5 py-1 rounded-[4px] transition-all ${banner.isActive ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'}`}>
                                                    {banner.isActive ? "Deactivate" : "Activate"}
                                                </button>
                                                <button type="button" onClick={() => handleEdit(banner)} className="p-1 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-[4px]">
                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                </button>
                                                <button type="button" onClick={() => setConfirmDeleteId(banner.id)} className="p-1 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-[4px]">
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
