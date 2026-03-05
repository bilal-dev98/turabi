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
    const [tab, setTab] = useState("templates") // 'templates' | 'create'
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
        const { name, value, type, checked } = e.target;
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
            autoActivate: false, // Don't auto activate on edit by default
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

    return (
        <div className="p-6 lg:p-10 max-w-6xl mx-auto w-full space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
                    Announcement <span className="text-slate-400 font-medium">Banners</span>
                </h1>
                <p className="text-sm text-slate-500 mt-1">Create and manage site-wide announcement banners shown at the top of your store.</p>
            </div>

            {/* System Warnings */}
            {!loading && banners.length > 0 && !banners.some(b => b.isActive) && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-4 items-start shadow-sm">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <h3 className="text-amber-800 font-bold text-sm">No Active Banner</h3>
                        <p className="text-amber-700 text-xs mt-0.5">Your store currently has no active announcements. The banner section will remain hidden on the frontend. Activate a banner below or create a new one to show announcements.</p>
                    </div>
                </div>
            )}

            {/* Live Preview */}
            {form.message && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 border-b">Live Preview</p>
                    <div style={{ background: form.gradient }} className="px-6 py-2.5">
                        <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
                            <p style={{ color: form.textColor }} className="text-sm font-medium">{form.message}</p>
                            <div className="flex items-center gap-4 shrink-0">
                                {form.buttonLabel && (
                                    <button type="button" className="font-normal text-gray-800 bg-white px-5 py-1.5 rounded-full text-sm whitespace-nowrap">
                                        {form.buttonLabel}
                                    </button>
                                )}
                                <span style={{ color: form.textColor }} className="material-symbols-outlined text-sm cursor-pointer">close</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                <button type="button" onClick={() => setTab("templates")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "templates" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}>
                    📋 Templates
                </button>
                <button type="button" onClick={() => { setTab("create"); setEditingId(null); setForm(EMPTY_FORM) }} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "create" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}>
                    ✏️ {editingId ? "Edit Banner" : "Custom Banner"}
                </button>
            </div>

            {/* Templates Grid */}
            {tab === "templates" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TEMPLATES.map((tmpl) => (
                        <button key={tmpl.label} type="button" onClick={() => handleApplyTemplate(tmpl)}
                            className="text-left bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all group">
                            <div className="size-10 rounded-xl flex items-center justify-center text-2xl mb-3" style={{ background: tmpl.data.gradient }}>
                                {tmpl.icon}
                            </div>
                            <p className="font-bold text-slate-800 text-sm">{tmpl.label}</p>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{tmpl.data.message}</p>
                            <p className="text-xs font-bold text-primary mt-3 group-hover:underline">Use this template →</p>
                        </button>
                    ))}
                </div>
            )}

            {/* Create / Edit Form */}
            {tab === "create" && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                    <h2 className="font-bold text-slate-900">{editingId ? "Edit Banner" : "Create Custom Banner"}</h2>

                    {/* Message */}
                    <label className="block">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message *</span>
                        <textarea name="message" value={form.message} onChange={handleChange} rows={2}
                            className="mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            placeholder="e.g. 🎉 Get 20% OFF with code NEW20" />
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Button Label */}
                        <label className="block">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Button Label</span>
                            <input type="text" name="buttonLabel" value={form.buttonLabel} onChange={handleChange}
                                className="mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="e.g. Claim Offer" />
                        </label>

                        {/* Button Action */}
                        <label className="block">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Button Action</span>
                            <select name="buttonAction" value={form.buttonAction} onChange={handleChange}
                                className="mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                                <option value="dismiss">Dismiss (close banner)</option>
                                <option value="coupon">Copy Coupon Code</option>
                                <option value="link">Navigate to Link</option>
                            </select>
                        </label>

                        {/* Coupon Code (if action = coupon) */}
                        {form.buttonAction === "coupon" && (
                            <label className="block">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Coupon Code</span>
                                <input type="text" name="couponCode" value={form.couponCode} onChange={handleChange}
                                    className="mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                                    placeholder="e.g. NEW20" />
                            </label>
                        )}

                        {/* Link URL (if action = link) */}
                        {form.buttonAction === "link" && (
                            <label className="block">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Link URL</span>
                                <input type="text" name="linkUrl" value={form.linkUrl} onChange={handleChange}
                                    className="mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="e.g. /products or https://..." />
                            </label>
                        )}
                    </div>

                    {/* Gradient Picker */}
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Background Gradient</span>
                        <div className="flex flex-wrap gap-2">
                            {GRADIENTS.map(g => (
                                <button key={g.value} type="button" onClick={() => setForm(f => ({ ...f, gradient: g.value }))}
                                    title={g.label}
                                    className={`h-8 w-16 rounded-lg transition-all ${form.gradient === g.value ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'}`}
                                    style={{ background: g.value }} />
                            ))}
                        </div>
                    </div>

                    {/* Text Color */}
                    <div className="flex items-center gap-4">
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Text Color</span>
                            <div className="flex items-center gap-3">
                                <input type="color" name="textColor" value={form.textColor} onChange={handleChange}
                                    className="size-9 rounded-lg border border-slate-200 cursor-pointer" />
                                <span className="text-sm font-mono text-slate-600">{form.textColor}</span>
                            </div>
                        </div>
                    </div>

                    {/* Auto Activate Option (Only when creating) */}
                    {!editingId && (
                        <label className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                            <input
                                type="checkbox"
                                name="autoActivate"
                                checked={form.autoActivate}
                                onChange={handleChange}
                                className="size-5 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <div>
                                <span className="text-sm font-bold text-slate-800 block">Activate immediately</span>
                                <span className="text-xs text-slate-500 block">This will replace the currently active banner.</span>
                            </div>
                        </label>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={handleSave} disabled={saving}
                            className="bg-primary text-slate-900 font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-50">
                            {saving ? "Saving..." : editingId ? "Update Banner" : "Create Banner"}
                        </button>
                        <button type="button" onClick={() => { setForm(EMPTY_FORM); setEditingId(null) }}
                            className="border border-slate-200 text-slate-600 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-all">
                            Reset
                        </button>
                    </div>
                </div>
            )}

            {/* Saved Banners */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-slate-900">Saved Banners <span className="text-slate-400 font-medium ml-1">({banners.length})</span></h2>
                </div>
                {loading ? (
                    <p className="text-sm text-slate-400">Loading...</p>
                ) : banners.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-200 mb-2 block">campaign</span>
                        <p className="text-slate-400 text-sm">No banners yet. Pick a template above to get started!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {banners.map(banner => (
                            <div key={banner.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${banner.isActive ? 'border-primary/30 ring-1 ring-primary/20' : 'border-slate-100'}`}>
                                {/* Banner preview strip */}
                                <div style={{ background: banner.gradient }} className="px-5 py-2">
                                    <p style={{ color: banner.textColor }} className="text-sm font-medium truncate">{banner.message}</p>
                                </div>
                                {/* Meta row */}
                                <div className="px-5 py-3 flex items-center gap-3 flex-wrap">
                                    {banner.isActive && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                                            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                                            Live on Site
                                        </span>
                                    )}
                                    {banner.buttonLabel && (
                                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                                            Button: {banner.buttonLabel} ({banner.buttonAction})
                                        </span>
                                    )}
                                    {banner.couponCode && (
                                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                                            Code: {banner.couponCode}
                                        </span>
                                    )}
                                    <span className="text-xs text-slate-400 ml-auto">
                                        {format(new Date(banner.createdAt), "MMM d, yyyy")}
                                    </span>
                                    {/* Actions */}
                                    <div className="flex items-center gap-1">
                                        {confirmDeleteId === banner.id ? (
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-slate-500 mr-1">Delete?</span>
                                                <button type="button" onClick={() => handleDelete(banner.id)}
                                                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all">
                                                    Yes
                                                </button>
                                                <button type="button" onClick={() => setConfirmDeleteId(null)}
                                                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <button type="button" onClick={() => handleActivate(banner.id, banner.isActive)}
                                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${banner.isActive ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                                                    {banner.isActive ? "Deactivate" : "Activate"}
                                                </button>
                                                <button type="button" onClick={() => handleEdit(banner)}
                                                    className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                </button>
                                                <button type="button" onClick={() => setConfirmDeleteId(banner.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
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
