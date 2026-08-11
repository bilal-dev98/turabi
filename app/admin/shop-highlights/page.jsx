'use client'
import { useEffect, useState, useRef } from "react"
import toast from "react-hot-toast"
import { CardStack } from "@/components/CardStack"

const EMPTY_FORM = {
    title: "",
    description: "",
    imageSrc: "",
    href: "/shop",
    order: 0,
    isActive: true
}

export default function AdminShopHighlights() {
    const [highlights, setHighlights] = useState([])
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState(EMPTY_FORM)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [showPreview, setShowPreview] = useState(false)
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)
    const fileInputRef = useRef(null)

    const fetchHighlights = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/highlights')
            const data = await res.json()
            if (data.success) {
                setHighlights(data.data)
            } else {
                toast.error("Failed to load highlights")
            }
        } catch (err) {
            toast.error("Error connecting to server")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHighlights()
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleFileUpload = async (file) => {
        if (!file) return
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return
        }

        setUploading(true)
        const toastId = toast.loading('Uploading image to Cloudflare R2...')

        try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            const data = await res.json()
            if (data.success) {
                setForm(prev => ({ ...prev, imageSrc: data.url }))
                toast.success('Image uploaded to R2! 🚀', { id: toastId })
            } else {
                toast.error(data.message || 'Upload failed', { id: toastId })
            }
        } catch (error) {
            toast.error('Failed to upload image', { id: toastId })
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async (e) => {
        e?.preventDefault()
        if (!form.title.trim()) {
            toast.error("Title is required")
            return
        }
        if (!form.imageSrc.trim()) {
            toast.error("Please upload or enter an image URL")
            return
        }

        setSaving(true)
        try {
            const isEdit = !!editingId
            const url = isEdit ? `/api/admin/highlights/${editingId}` : '/api/admin/highlights'
            const method = isEdit ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })

            const data = await res.json()
            if (data.success) {
                toast.success(isEdit ? "Highlight updated!" : "Highlight card created! 🎉")
                setForm(EMPTY_FORM)
                setEditingId(null)
                fetchHighlights()
            } else {
                toast.error(data.message || "Failed to save")
            }
        } catch (err) {
            toast.error("Error saving highlight card")
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (item) => {
        setForm({
            title: item.title,
            description: item.description || "",
            imageSrc: item.imageSrc,
            href: item.href || "/shop",
            order: item.order || 0,
            isActive: item.isActive
        })
        setEditingId(item.id)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleToggleActive = async (id, currentStatus) => {
        try {
            const res = await fetch(`/api/admin/highlights/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            })
            const data = await res.json()
            if (data.success) {
                toast.success(currentStatus ? "Card hidden from store" : "Card is now live! ✅")
                fetchHighlights()
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            toast.error("Failed to update status")
        }
    }

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/admin/highlights/${id}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Card deleted")
                setConfirmDeleteId(null)
                if (editingId === id) {
                    setEditingId(null)
                    setForm(EMPTY_FORM)
                }
                fetchHighlights()
            } else {
                toast.error(data.message || "Delete failed")
            }
        } catch (err) {
            toast.error("Error deleting card")
        }
    }

    const activeHighlights = highlights.filter(h => h.isActive)

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh] text-zinc-400 text-xs font-sans">
                <span className="material-symbols-outlined animate-spin text-emerald-500 text-xl mr-2">progress_activity</span>
                Loading Shop Highlights cards…
            </div>
        )
    }

    return (
        <div className="p-5 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6 font-sans antialiased">
            {/* Standard Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Shop the Highlights
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Manage dynamic showcase cards featured in the homepage collection stack.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {activeHighlights.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className="px-3.5 py-2 rounded-[4px] text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex items-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-sm">
                                {showPreview ? "visibility_off" : "visibility"}
                            </span>
                            {showPreview ? "Hide Preview" : "Live Store Preview"}
                        </button>
                    )}

                    {editingId && (
                        <button
                            type="button"
                            onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }}
                            className="px-3.5 py-2 rounded-[4px] text-xs font-semibold border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                        >
                            + Reset Form
                        </button>
                    )}
                </div>
            </div>

            {/* Optional Collapsible Live Stack Preview */}
            {showPreview && activeHighlights.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 overflow-hidden transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                            Live Store Stack Preview ({activeHighlights.length} active cards)
                        </span>
                        <span className="text-[11px] text-zinc-400">Drag or swipe cards to test</span>
                    </div>

                    <div className="w-full flex justify-center py-2">
                        <CardStack
                            items={activeHighlights}
                            cardWidth={360}
                            cardHeight={230}
                            initialIndex={0}
                            autoAdvance
                            intervalMs={3000}
                            pauseOnHover
                            showDots
                        />
                    </div>
                </div>
            )}

            {/* Create / Edit Card Form */}
            <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
                    <h2 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-emerald-500">
                            {editingId ? "edit_note" : "add_box"}
                        </span>
                        {editingId ? "Edit Highlight Card" : "Add New Highlight Card"}
                    </h2>
                    {editingId && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400">
                            Editing Card #{editingId}
                        </span>
                    )}
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Image Upload Box (Left Column) */}
                        <div className="md:col-span-1 space-y-2">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                Card Image (Cloudflare R2) *
                            </label>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative h-44 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 cursor-pointer transition bg-zinc-50 dark:bg-zinc-900/40 group flex flex-col items-center justify-center p-3 text-center overflow-hidden"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e.target.files?.[0])}
                                    className="hidden"
                                />

                                {form.imageSrc ? (
                                    <>
                                        <img
                                            src={form.imageSrc}
                                            alt="Preview"
                                            className="absolute inset-0 w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-1.5">
                                            <span className="material-symbols-outlined text-base">cloud_upload</span>
                                            <span>Change Image</span>
                                        </div>
                                    </>
                                ) : uploading ? (
                                    <div className="flex flex-col items-center gap-2 text-emerald-500 text-xs">
                                        <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                                        <span>Uploading to R2…</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="size-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-xl">cloud_upload</span>
                                        </div>
                                        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                                            Click to Upload Image
                                        </p>
                                        <p className="text-[10px] text-zinc-400 mt-0.5">
                                            Cloudflare R2 Direct Sync
                                        </p>
                                    </>
                                )}
                            </div>

                            <input
                                type="text"
                                name="imageSrc"
                                value={form.imageSrc}
                                onChange={handleChange}
                                placeholder="Or paste image URL"
                                className="w-full bg-white dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 rounded-[4px] px-3 py-1.5 text-[11px] font-mono text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                            />
                        </div>

                        {/* Input Fields (Right Column) */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                                        Card Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Built for Luxury & Elegance"
                                        className="w-full bg-white dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                    />
                                </div>

                                {/* Link / Href */}
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                                        Button Action Link (href)
                                    </label>
                                    <input
                                        type="text"
                                        name="href"
                                        value={form.href}
                                        onChange={handleChange}
                                        placeholder="/shop or /product/123"
                                        className="w-full bg-white dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 rounded-[4px] px-3.5 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                                    Card Description / Subtitle
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="e.g. Masterfully crafted jewelry designed to shine"
                                    className="w-full bg-white dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
                                {/* Order */}
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                                        Display Sequence Order
                                    </label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={form.order}
                                        onChange={handleChange}
                                        min={0}
                                        className="w-full bg-white dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                    />
                                </div>

                                {/* Active Switch */}
                                <div className="pt-2 sm:pt-4">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={form.isActive}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-8 h-4.5 bg-zinc-200 peer-focus:outline-hidden rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all dark:after:border-zinc-600 peer-checked:bg-emerald-500"></div>
                                        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                                            Publish Live on Store
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                        {editingId && (
                            <button
                                type="button"
                                onClick={() => { setForm(EMPTY_FORM); setEditingId(null); }}
                                className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-semibold rounded-[4px] text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            >
                                Cancel
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={saving || uploading}
                            className="bg-zinc-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-semibold px-5 py-2 rounded-[4px] text-xs shadow-xs hover:bg-zinc-800 dark:hover:bg-emerald-400 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm">save</span>
                                    {editingId ? "Update Card Changes" : "Save & Add Card"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Saved Cards Table List */}
            <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-sm text-zinc-900 dark:text-white">
                            Saved Highlight Cards
                        </h2>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                            Total {highlights.length} cards configured in store collection
                        </p>
                    </div>
                </div>

                {highlights.length === 0 ? (
                    <div className="p-10 text-center text-zinc-400 text-xs">
                        No highlight cards saved yet. Use the form above to upload images and add cards!
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                        {highlights.map((item) => (
                            <div
                                key={item.id}
                                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                                    item.isActive ? "hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30" : "opacity-60 bg-zinc-50/40 dark:bg-zinc-950/40"
                                }`}
                            >
                                {/* Left: Thumbnail Image & Card Info */}
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <div className="size-14 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0 bg-black">
                                        <img
                                            src={item.imageSrc}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{item.title}</h3>
                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 shrink-0">
                                                Order #{item.order}
                                            </span>
                                        </div>
                                        {item.description && (
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{item.description}</p>
                                        )}
                                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 truncate block mt-0.5">
                                            {item.href || "/shop"}
                                        </span>
                                    </div>
                                </div>

                                {/* Right: Active Switch & Actions */}
                                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] ${
                                            item.isActive
                                                ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400"
                                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                                        }`}>
                                            {item.isActive ? "Live" : "Hidden"}
                                        </span>

                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={item.isActive}
                                                onChange={() => handleToggleActive(item.id, item.isActive)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-8 h-4.5 bg-zinc-200 peer-focus:outline-hidden rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all dark:after:border-zinc-600 peer-checked:bg-emerald-500"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center gap-1.5 border-l border-zinc-200 dark:border-zinc-800 pl-3">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(item)}
                                            className="p-1.5 text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition"
                                            title="Edit Card"
                                        >
                                            <span className="material-symbols-outlined text-base">edit</span>
                                        </button>

                                        {confirmDeleteId === item.id ? (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-[10px] font-bold px-2 py-1 rounded bg-rose-600 text-white"
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmDeleteId(null)}
                                                    className="text-[10px] font-bold px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setConfirmDeleteId(item.id)}
                                                className="p-1.5 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition"
                                                title="Delete Card"
                                            >
                                                <span className="material-symbols-outlined text-base">delete</span>
                                            </button>
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
