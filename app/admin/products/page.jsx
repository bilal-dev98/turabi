'use client'
import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import { productDummyData, categories } from "@/assets/assets"
import toast from "react-hot-toast"
import { AVAILABLE_COLORS } from "@/lib/colors"
import Pagination from "@/components/admin/Pagination"
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal"
import AdminProductReviews from "@/components/admin/AdminProductReviews"
import { exportToCSV } from "@/lib/csvExport"

const PER_PAGE = 10
const STATUS_BADGE = {
    true: { label: "In Stock", cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" },
    false: { label: "Out of Stock", cls: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300" }
}
const EMPTY_FORM = { name: "", description: "", price: "", mrp: "", category: categories[0], inStock: true, images: [], colors: [] }

export default function AdminProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [selected, setSelected] = useState(new Set())
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [deleteTarget, setDeleteTarget] = useState(null) // id or "bulk"
    const [uploading, setUploading] = useState(false)
    const [activeTab, setActiveTab] = useState("details") // "details" | "reviews"
    const [enableReviewsOnAdd, setEnableReviewsOnAdd] = useState(true)
    const [reviewCountOnAdd, setReviewCountOnAdd] = useState(5)

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/products')
            const data = await res.json()
            if (data.success) {
                setProducts(data.data)
            } else {
                toast.error(data.message || "Failed to fetch products")
            }
        } catch (error) {
            toast.error("Error fetching products")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchProducts() }, [])

    // --- Filtering & pagination ---
    const filtered = useMemo(() =>
        products.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase())
        ), [products, search])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    const handleSearch = (val) => { setSearch(val); setPage(1); setSelected(new Set()) }

    // --- Selection ---
    const toggleSelect = (id) => setSelected(prev => {
        const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next
    })
    const toggleAll = () => {
        if (selected.size === paginated.length) setSelected(new Set())
        else setSelected(new Set(paginated.map(p => p.id)))
    }

    // --- CRUD ---
    const openAdd = () => { setActiveTab("details"); setEditing(null); setForm(EMPTY_FORM); setEnableReviewsOnAdd(true); setReviewCountOnAdd(5); setShowModal(true) }
    const openEdit = (p) => {
        setActiveTab("details")
        setEditing(p.id)
        setForm({ name: p.name, description: p.description, price: p.price, mrp: p.mrp, category: p.category, inStock: p.inStock, images: p.images || [], colors: p.colors || [] })
        setShowModal(true)
    }

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files)
        if (!files.length) return

        setUploading(true)
        const toastId = toast.loading("Uploading images...")
        const uploadedUrls = []

        try {
            for (const file of files) {
                const formData = new FormData()
                formData.append('file', file)

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                })
                const data = await res.json()

                if (data.success) {
                    uploadedUrls.push(data.url)
                } else {
                    toast.error(`Failed to upload ${file.name}: ${data.message}`)
                }
            }
            if (uploadedUrls.length > 0) {
                setForm(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }))
                toast.success("Images uploaded successfully", { id: toastId })
            } else {
                toast.dismiss(toastId)
            }
        } catch (error) {
            toast.error("Error uploading images", { id: toastId })
        } finally {
            setUploading(false)
        }
    }
    const removeImage = (idx) => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (editing) {
            try {
                const res = await fetch(`/api/products/${editing}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form)
                })
                const data = await res.json()
                if (data.success) {
                    setProducts(prev => prev.map(p => p.id === editing ? data.data : p))
                    toast.success("Product updated!")
                    setShowModal(false)
                } else {
                    toast.error(data.message || "Failed to update product")
                }
            } catch (err) {
                toast.error("Error updating product")
            }
        } else {
            try {
                const res = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form)
                })
                const data = await res.json()
                if (data.success) {
                    const createdProduct = data.data;

                    // If Enable Reviews was checked during creation, generate smart reviews!
                    if (enableReviewsOnAdd && reviewCountOnAdd > 0) {
                        try {
                            await fetch(`/api/products/${createdProduct.id}/generate-reviews`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ count: reviewCountOnAdd })
                            });
                            toast.success(`Product created with ${reviewCountOnAdd} smart reviews!`);
                        } catch (err) {
                            toast.success("Product added! (Reviews generation failed)");
                        }
                    } else {
                        toast.success("Product added!")
                    }

                    setProducts(prev => [createdProduct, ...prev])
                    setShowModal(false)
                } else {
                    toast.error(data.message || "Failed to add product")
                }
            } catch (err) {
                toast.error("Error adding product")
            }
        }
    }

    const confirmDelete = (id) => setDeleteTarget(id)
    const confirmBulkDelete = () => setDeleteTarget("bulk")

    const executeDelete = async () => {
        if (deleteTarget === "bulk") {
            try {
                await Promise.all(Array.from(selected).map(id => fetch(`/api/products/${id}`, { method: 'DELETE' })))
                setProducts(prev => prev.filter(p => !selected.has(p.id)))
                setSelected(new Set())
                toast.success(`${selected.size} products deleted!`)
            } catch (err) {
                toast.error("Error deleting products")
            }
        } else {
            try {
                await fetch(`/api/products/${deleteTarget}`, { method: 'DELETE' })
                setProducts(prev => prev.filter(p => p.id !== deleteTarget))
                toast.success("Product deleted!")
            } catch (err) {
                toast.error("Error deleting product")
            }
        }
        setDeleteTarget(null)
    }

    const toggleStock = async (id) => {
        const product = products.find(p => p.id === id)
        if (!product) return
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inStock: !product.inStock })
            })
            const data = await res.json()
            if (data.success) {
                setProducts(prev => prev.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p))
                toast.success("Stock status updated")
            }
        } catch (err) {
            toast.error("Error updating stock status")
        }
    }

    const bulkToggleStock = async (inStock) => {
        try {
            await Promise.all(Array.from(selected).map(id =>
                fetch(`/api/products/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ inStock })
                })
            ))
            setProducts(prev => prev.map(p => selected.has(p.id) ? { ...p, inStock } : p))
            toast.success(`${selected.size} products ${inStock ? "marked In Stock" : "marked Out of Stock"}`)
            setSelected(new Set())
        } catch (err) {
            toast.error("Error updating products")
        }
    }

    const handleExport = () => {
        const rows = filtered.map(p => ({
            ID: p.id, Name: p.name, Category: p.category,
            Price: p.price, MRP: p.mrp,
            InStock: p.inStock ? "Yes" : "No",
            Ratings: p.rating?.length || 0
        }))
        exportToCSV(rows, "products")
        toast.success("Exported as products.csv")
    }

    if (loading) return <div className="p-8 flex items-center gap-3 text-zinc-400 dark:text-zinc-500 text-sm"><span className="material-symbols-outlined animate-spin text-emerald-500">progress_activity</span>Loading products…</div>

    const lowStockCount = products.filter(p => !p.inStock).length

    return (
        <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Products</h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{products.length} total products</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={handleExport} className="flex items-center gap-2 border border-slate-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 px-3.5 py-2 rounded-[4px] text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Export CSV
                    </button>
                    <button onClick={openAdd} className="flex items-center gap-2 bg-zinc-900 dark:bg-emerald-500 text-white dark:text-slate-950 px-3.5 py-2 rounded-[4px] font-semibold text-xs shadow-xs hover:bg-zinc-800 dark:hover:bg-emerald-400 transition-all">
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add Product
                    </button>
                </div>
            </div>

            {/* Low stock alert */}
            {lowStockCount > 0 && (
                <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-[4px] px-4 py-3">
                    <span className="material-symbols-outlined text-amber-500 text-sm">warning</span>
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                        {lowStockCount} product{lowStockCount > 1 ? "s are" : " is"} out of stock. <button className="underline" onClick={() => handleSearch("")}>View all</button>
                    </p>
                </div>
            )}

            {/* Search + Bulk bar */}
            <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] px-4 py-2.5 flex items-center gap-3 flex-wrap shadow-xs">
                <span className="material-symbols-outlined text-zinc-400 text-sm">search</span>
                <input value={search} onChange={e => handleSearch(e.target.value)}
                    placeholder="Search by name or category…"
                    className="flex-1 min-w-[160px] bg-transparent text-xs text-zinc-700 dark:text-zinc-200 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500" />
                {search && <button onClick={() => handleSearch("")} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"><span className="material-symbols-outlined text-sm">close</span></button>}
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 border-l border-zinc-200 dark:border-zinc-800 pl-3">{filtered.length} results</span>

                {/* Bulk actions */}
                {selected.size > 0 && (
                    <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-800 pl-3">
                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{selected.size} selected</span>
                        <button onClick={() => bulkToggleStock(true)} className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-[4px] hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-all">In Stock</button>
                        <button onClick={() => bulkToggleStock(false)} className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 rounded-[4px] hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-all">Out of Stock</button>
                        <button onClick={confirmBulkDelete} className="text-xs font-semibold px-2.5 py-1 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 rounded-[4px] hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-all">
                            <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                            <tr>
                                <th className="px-5 py-3">
                                    <input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0}
                                        onChange={toggleAll}
                                        className="size-3.5 rounded-[4px] accent-emerald-500 cursor-pointer" />
                                </th>
                                {["Product", "Category", "Price", "MRP", "Stock", "Ratings", ""].map(h => (
                                    <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {paginated.length === 0 && (
                                <tr><td colSpan={8} className="px-6 py-16 text-center text-zinc-400 dark:text-zinc-600 text-sm">No products found.</td></tr>
                            )}
                            {paginated.map(product => (
                                <tr key={product.id} className={`hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors ${selected.has(product.id) ? "bg-emerald-50/30 dark:bg-emerald-950/10" : ""}`}>
                                    <td className="px-5 py-3">
                                        <input type="checkbox" checked={selected.has(product.id)} onChange={() => toggleSelect(product.id)}
                                            className="size-3.5 rounded-[4px] accent-emerald-500 cursor-pointer" />
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 rounded-[4px] overflow-hidden bg-zinc-100 dark:bg-slate-700 shrink-0">
                                                {product.images?.[0] && (
                                                    <Image src={product.images[0]} alt={product.name} width={36} height={36} className="object-cover w-full h-full" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 max-w-[180px] truncate">{product.name}</p>
                                                <p className="text-[10px] text-zinc-400 font-mono truncate max-w-[120px]">{product.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className="inline-flex px-2 py-0.5 rounded-[4px] text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">{product.category}</span>
                                    </td>
                                    <td className="px-5 py-3 text-xs font-bold text-zinc-900 dark:text-white">Rs {product.price}</td>
                                    <td className="px-5 py-3 text-xs text-zinc-400 line-through">Rs {product.mrp}</td>
                                    <td className="px-5 py-3">
                                        <button onClick={() => toggleStock(product.id)}
                                            className={`inline-flex px-2 py-0.5 rounded-[4px] text-[10px] font-bold cursor-pointer transition-all ${STATUS_BADGE[product.inStock].cls}`}>
                                            {STATUS_BADGE[product.inStock].label}
                                        </button>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-300">
                                            <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                                            <span className="font-semibold">
                                                {product.rating?.length > 0
                                                    ? (product.rating.reduce((a, r) => a + r.rating, 0) / product.rating.length).toFixed(1)
                                                    : "–"}
                                            </span>
                                            <span className="text-zinc-400 dark:text-zinc-500 text-[10px]">({product.rating?.length || 0})</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openEdit(product)} className="p-1.5 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-[4px] transition-all">
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                            <button onClick={() => confirmDelete(product.id)} className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-[4px] transition-all">
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-5 py-3.5 border-t border-zinc-200 dark:border-zinc-800">
                    <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                    <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                            <div className="flex-1">
                                <h2 className="text-sm font-bold text-zinc-900 dark:text-white">{editing ? "Edit Product" : "Add New Product"}</h2>
                                {editing && (
                                    <div className="flex items-center gap-4 mt-2.5 -mb-3.5">
                                        <button onClick={() => setActiveTab("details")} className={`pb-2.5 text-xs font-bold border-b-2 transition-colors ${activeTab === "details" ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}>Details</button>
                                        <button onClick={() => setActiveTab("reviews")} className={`pb-2.5 text-xs font-bold border-b-2 transition-colors ${activeTab === "reviews" ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}>Custom Reviews</button>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[4px] transition-colors">
                                <span className="material-symbols-outlined text-sm text-zinc-500 dark:text-zinc-400">close</span>
                            </button>
                        </div>

                        <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
                            {activeTab === "details" ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Product Name</label>
                                        <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                            className="w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all"
                                            placeholder="e.g. Cotton Kurta Set" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Sale Price ($)</label>
                                            <input required type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                                className="w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all" placeholder="29" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">MRP ($)</label>
                                            <input required type="number" min="0" value={form.mrp} onChange={e => setForm(f => ({ ...f, mrp: e.target.value }))}
                                                className="w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all" placeholder="59" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Category</label>
                                            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                                className="w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all">
                                                {categories.map(c => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Stock Status</label>
                                            <select value={form.inStock} onChange={e => setForm(f => ({ ...f, inStock: e.target.value === "true" }))}
                                                className="w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all">
                                                <option value="true">In Stock</option>
                                                <option value="false">Out of Stock</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Description</label>
                                        <textarea required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                            className="w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 resize-none transition-all"
                                            placeholder="Describe the product…" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Available Colors</label>
                                        <div className="flex flex-wrap gap-2.5">
                                            {AVAILABLE_COLORS.map(color => {
                                                const isSelected = form.colors?.includes(color.name);
                                                return (
                                                    <button
                                                        key={color.name}
                                                        type="button"
                                                        title={color.name}
                                                        onClick={() => {
                                                            const newColors = isSelected
                                                                ? form.colors.filter(c => c !== color.name)
                                                                : [...(form.colors || []), color.name];
                                                            setForm(f => ({ ...f, colors: newColors }));
                                                        }}
                                                        className={`w-6 h-6 rounded-full transition-all flex items-center justify-center shrink-0 ${isSelected ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : 'ring-1 ring-slate-200 dark:ring-slate-700 hover:scale-105'}`}
                                                        style={{ backgroundColor: color.hex }}
                                                    >
                                                        {isSelected && (
                                                            <span className="material-symbols-outlined text-white text-xs" style={{ textShadow: '0 0 2px rgba(0,0,0,0.5)' }}>check</span>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    {/* Image section */}
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Product Images</label>
                                        {form.images?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {form.images.map((img, idx) => (
                                                    <div key={idx} className="relative group size-16 rounded-[4px] overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shrink-0">
                                                        <img src={typeof img === "string" ? img : img?.src || ""} alt="" className="w-full h-full object-cover" />
                                                        <button type="button" onClick={() => removeImage(idx)}
                                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-white text-sm">delete</span>
                                                        </button>
                                                        {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-emerald-600/90 text-white text-[8px] font-bold text-center py-0.5">MAIN</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <label className="flex flex-col items-center gap-2 border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-emerald-400 dark:hover:border-emerald-600 bg-zinc-50 dark:bg-zinc-800/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 rounded-[4px] py-5 cursor-pointer transition-all">
                                            <span className="material-symbols-outlined text-zinc-400 dark:text-zinc-500 text-2xl">add_photo_alternate</span>
                                            <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Click to upload images</p>
                                            <p className="text-[10px] text-zinc-400 dark:text-zinc-600">PNG, JPG, WEBP</p>
                                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                                        </label>

                                        {/* Customer Reviews Section (for New Product Creation) */}
                                        {!editing && (
                                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-[4px] p-4 space-y-3 mt-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-sm">auto_awesome</span>
                                                        <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Customer Reviews</h3>
                                                    </div>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={enableReviewsOnAdd}
                                                            onChange={e => setEnableReviewsOnAdd(e.target.checked)}
                                                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 size-4"
                                                        />
                                                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Enable Smart Reviews</span>
                                                    </label>
                                                </div>

                                                {enableReviewsOnAdd && (
                                                    <div className="flex items-center gap-3 pt-1">
                                                        <div className="flex-1">
                                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">Number of Reviews to Generate</label>
                                                            <select
                                                                value={reviewCountOnAdd}
                                                                onChange={e => setReviewCountOnAdd(Number(e.target.value))}
                                                                className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                            >
                                                                {[1, 2, 3, 5, 10, 15, 20, 25, 30, 50, 75, 100].map(n => (
                                                                    <option key={n} value={n}>{n} Reviews</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 max-w-[200px] leading-tight">
                                                            Auto-generates Pakistani reviews with realistic 4★–5★ ratings upon save.
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                    <div className="flex gap-2.5 pt-2">
                                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-slate-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 py-2.5 rounded-[4px] font-semibold text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">Cancel</button>
                                        <button type="submit" className="flex-1 bg-zinc-900 dark:bg-emerald-500 text-white dark:text-slate-950 py-2.5 rounded-[4px] font-semibold text-xs shadow-xs hover:bg-zinc-800 dark:hover:bg-emerald-400 transition-all">
                                            {editing ? "Save Changes" : (enableReviewsOnAdd ? `Add Product & Generate (${reviewCountOnAdd} Reviews)` : "Add Product")}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <AdminProductReviews productId={editing} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirmation */}
            <DeleteConfirmModal
                open={!!deleteTarget}
                title={deleteTarget === "bulk" ? `Delete ${selected.size} products?` : "Delete this product?"}
                description="This action cannot be undone."
                onConfirm={executeDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    )
}
