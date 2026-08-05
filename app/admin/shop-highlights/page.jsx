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
            <div className="p-8 flex items-center gap-3 text-zinc-400 text-sm">
                <span className="material-symbols-outlined animate-spin text-emerald-500">progress_activity</span>
                Loading Shop Highlights cards…
            </div>
        )
    }

    return (
        <div className="p-5 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-500">style</span>
                        Shop the Highlights
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Manage the dynamic card stack collection featured on your homepage. Images are stored securely on Cloudflare R2.
                    </p>
                </div>

                {editingId && (
                    <button
                        onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }}
                        className="px-3.5 py-1.5 rounded-[4px] text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 transition"
                    >
                        + Create New Card
                    </button>
                )}
            </div>

            {/* Live Stack Preview */}
            {activeHighlights.length > 0 && (
                <div className="bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 sm:p-6 overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live Store Preview ({activeHighlights.length} active cards)
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

            {/* Create / Edit Form */}
            <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs p-5 sm:p-6 space-y-5">
                <h2 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-emerald-500">
                        {editingId ? "edit" : "add_circle"}
                    </span>
                    {editingId ? "Edit Highlight Card" : "Add New Highlight Card"}
                </h2>

                <form onSubmit={handleSave} className="space-y-4">
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
                                placeholder="e.g. Luxury Performance"
                                className="w-full bg-white dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                            />
                        </div>

                        {/* Link / Href */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                                Button Link URL (href)
                            </label>
                            <input
                                type="text"
                                name="href"
                                value={form.href}
                                onChange={handleChange}
                                placeholder="/shop or /product/123"
                                className="w-full bg-white dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                            Card Subtitle / Description
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={2}
                            placeholder="e.g. Built with passion, driven by excellence"
                            className="w-full bg-white dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none transition"
                        />
                    </div>

                    {/* Image Upload Box */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                            Card Image (Cloudflare R2 Upload) *
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                            {/* Upload Dropzone */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="sm:col-span-2 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl p-5 text-center cursor-pointer transition bg-zinc-50/50 dark:bg-zinc-800/20 group flex flex-col items-center justify-center min-h-[140px]"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e.target.files?.[0])}
                                    className="hidden"
                                />

                                {uploading ? (
                                    <div className="flex flex-col items-center gap-2 text-emerald-500 text-xs">
                                        <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                                        <span>Uploading to Cloudflare R2…</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="size-10 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                                            <span className="material-symbols-outlined text-xl">cloud_upload</span>
                                        </div>
                                        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                                            Click to browse or drop an image
                                        </p>
                                        <p className="text-[11px] text-zinc-400 mt-0.5">
                                            PNG, JPG, WEBP recommended (Max 5MB)
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Image Preview & URL fallback */}
                            <div className="space-y-2">
                                {form.imageSrc ? (
                                    <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 h-[110px] w-full bg-black group">
                                        <img
                                            src={form.imageSrc}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setForm(p => ({ ...p, imageSrc: "" }))}
                                            className="absolute top-2 right-2 size-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-600 transition"
                                            title="Remove image"
                                        >
                                            <span className="material-symbols-outlined text-xs">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 h-[110px] w-full bg-zinc-100 dark:bg-zinc-800/40 flex items-center justify-center text-zinc-400 text-xs font-medium">
                                        No Image Selected
                                    </div>
                                )}

                                <input
                                    type="text"
                                    name="imageSrc"
                                    value={form.imageSrc}
                                    onChange={handleChange}
                                    placeholder="Or paste image URL"
                                    className="w-full bg-white dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-[4px] px-2.5 py-1.5 text-[11px] text-zinc-900 dark:text-zinc-100 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        {/* Order */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                                Display Order Index
                            </label>
                            <input
                                type="number"
                                name="order"
                                value={form.order}
                                onChange={handleChange}
                                min={0}
                                className="w-full bg-white dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none"
                            />
                        </div>

                        {/* Active status */}
                        <div className="pt-4 sm:pt-0">
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={form.isActive}
                                    onChange={handleChange}
                                    className="size-4 rounded accent-emerald-500"
                                />
                                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                                    Show on store live
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Form actions */}
                    <div className="flex items-center gap-3 pt-3">
                        <button
                            type="submit"
                            disabled={saving || uploading}
                            className="bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-[4px] text-xs hover:bg-emerald-400 transition shadow-xs disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm">save</span>
                                    {editingId ? "Update Card" : "Add Card to Highlights"}
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setForm(EMPTY_FORM); setEditingId(null); }}
                            className="border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold px-4 py-2.5 rounded-[4px] text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                        >
                            Cancel / Reset
                        </button>
                    </div>
                </form>
            </div>

            {/* Saved Cards List */}
            <div className="space-y-4">
                <h2 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                    <span>Manage Saved Cards</span>
                    <span className="text-xs font-normal text-zinc-400">({highlights.length} total)</span>
                </h2>

                {highlights.length === 0 ? (
                    <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center">
                        <span className="material-symbols-outlined text-3xl text-zinc-300 dark:text-zinc-600 mb-1 block">style</span>
                        <p className="text-zinc-400 text-xs">No highlight cards saved yet. Use the form above to add cards!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {highlights.map((item) => (
                            <div
                                key={item.id}
                                className={`bg-white dark:bg-[#121215] rounded-xl border shadow-xs overflow-hidden flex flex-col justify-between transition-all ${
                                    item.isActive
                                        ? 'border-zinc-200 dark:border-zinc-800'
                                        : 'border-zinc-200 dark:border-zinc-800/40 opacity-60 bg-zinc-50 dark:bg-zinc-900/30'
                                }`}
                            >
                                {/* Card image banner */}
                                <div className="relative h-40 w-full bg-zinc-900 overflow-hidden">
                                    <img
                                        src={item.imageSrc}
                                        alt={item.title}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    <div className="absolute bottom-3 left-3 right-3 text-white">
                                        <p className="font-bold text-sm truncate">{item.title}</p>
                                        {item.description && (
                                            <p className="text-xs text-white/80 line-clamp-1 mt-0.5">{item.description}</p>
                                        )}
                                    </div>

                                    {/* Order badge */}
                                    <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        Order: {item.order}
                                    </span>

                                    {/* Status badge */}
                                    <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        item.isActive
                                            ? 'bg-emerald-500 text-slate-950'
                                            : 'bg-zinc-700 text-zinc-300'
                                    }`}>
                                        {item.isActive ? 'Active' : 'Hidden'}
                                    </span>
                                </div>

                                {/* Card Actions */}
                                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => handleToggleActive(item.id, item.isActive)}
                                        className={`text-[11px] font-bold px-2.5 py-1 rounded-[4px] transition ${
                                            item.isActive
                                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                        }`}
                                    >
                                        {item.isActive ? 'Hide Card' : 'Show Card'}
                                    </button>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(item)}
                                            className="p-1.5 text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition"
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
                                                    Confirm
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
