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
    true: { label: "In Stock", cls: "bg-primary/10 text-primary" },
    false: { label: "Out of Stock", cls: "bg-red-100 text-red-500" }
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
    const openAdd = () => { setActiveTab("details"); setEditing(null); setForm(EMPTY_FORM); setShowModal(true) }
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
                    setProducts(prev => [data.data, ...prev])
                    toast.success("Product added!")
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

    if (loading) return <div className="p-10 text-slate-400">Loading...</div>

    const lowStockCount = products.filter(p => !p.inStock).length

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">Products <span className="text-slate-400 font-medium">Management</span></h1>
                    <p className="text-sm text-slate-500 mt-1">{products.length} total products</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={handleExport} className="flex items-center gap-2 border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Export CSV
                    </button>
                    <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add Product
                    </button>
                </div>
            </div>

            {/* Low stock alert */}
            {lowStockCount > 0 && (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <span className="material-symbols-outlined text-amber-500">warning</span>
                    <p className="text-sm font-semibold text-amber-700">
                        {lowStockCount} product{lowStockCount > 1 ? "s are" : " is"} out of stock. <button className="underline" onClick={() => handleSearch("")}>View all</button>
                    </p>
                </div>
            )}

            {/* Search + Bulk bar */}
            <div className="bg-white rounded-2xl px-5 py-3.5 shadow-sm shadow-primary/5 border border-primary/5 flex items-center gap-4 flex-wrap">
                <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
                <input value={search} onChange={e => handleSearch(e.target.value)}
                    placeholder="Search by name or category…"
                    className="flex-1 min-w-[160px] bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
                {search && <button onClick={() => handleSearch("")} className="text-slate-400"><span className="material-symbols-outlined text-sm">close</span></button>}
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 border-l border-slate-100 pl-4">{filtered.length} results</span>

                {/* Bulk actions */}
                {selected.size > 0 && (
                    <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                        <span className="text-xs font-bold text-slate-600">{selected.size} selected</span>
                        <button onClick={() => bulkToggleStock(true)} className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all">In Stock</button>
                        <button onClick={() => bulkToggleStock(false)} className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-all">Out of Stock</button>
                        <button onClick={confirmBulkDelete} className="text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all">
                            <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm shadow-primary/5 border border-primary/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] uppercase tracking-widest font-bold text-slate-400">
                            <th className="px-5 py-4">
                                <input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0}
                                    onChange={toggleAll}
                                    className="size-4 rounded accent-primary cursor-pointer" />
                            </th>
                            <th className="px-5 py-4">Product</th>
                            <th className="px-5 py-4">Category</th>
                            <th className="px-5 py-4">Price</th>
                            <th className="px-5 py-4">MRP</th>
                            <th className="px-5 py-4">Stock</th>
                            <th className="px-5 py-4">Ratings</th>
                            <th className="px-5 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginated.length === 0 && (
                            <tr><td colSpan={8} className="px-6 py-16 text-center text-slate-400 text-sm">No products found.</td></tr>
                        )}
                        {paginated.map(product => (
                            <tr key={product.id} className={`hover:bg-slate-50/50 transition-colors ${selected.has(product.id) ? "bg-primary/5" : ""}`}>
                                <td className="px-5 py-3.5">
                                    <input type="checkbox" checked={selected.has(product.id)} onChange={() => toggleSelect(product.id)}
                                        className="size-4 rounded accent-primary cursor-pointer" />
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                            {product.images?.[0] && (
                                                <Image src={product.images[0]} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 max-w-[180px] truncate">{product.name}</p>
                                            <p className="text-[10px] text-slate-400 font-mono">{product.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">{product.category}</span>
                                </td>
                                <td className="px-5 py-3.5 text-sm font-bold text-slate-900">${product.price}</td>
                                <td className="px-5 py-3.5 text-sm text-slate-400 line-through">${product.mrp}</td>
                                <td className="px-5 py-3.5">
                                    <button onClick={() => toggleStock(product.id)}
                                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-all ${STATUS_BADGE[product.inStock].cls}`}>
                                        {STATUS_BADGE[product.inStock].label}
                                    </button>
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-1 text-sm text-slate-600">
                                        <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                                        <span className="font-semibold">
                                            {product.rating?.length > 0
                                                ? (product.rating.reduce((a, r) => a + r.rating, 0) / product.rating.length).toFixed(1)
                                                : "–"}
                                        </span>
                                        <span className="text-slate-400 text-xs">({product.rating?.length || 0})</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => openEdit(product)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button onClick={() => confirmDelete(product.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="px-5 pb-4">
                    <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col">
                        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 shrink-0">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">{editing ? "Edit Product" : "Add New Product"}</h2>
                                {editing && (
                                    <div className="flex items-center gap-4 mt-3 -mb-4">
                                        <button onClick={() => setActiveTab("details")} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "details" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"}`}>Details</button>
                                        <button onClick={() => setActiveTab("reviews")} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "reviews" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"}`}>Custom Reviews</button>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg -mt-6">
                                <span className="material-symbols-outlined text-sm text-slate-500">close</span>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {activeTab === "details" ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Product Name</label>
                                        <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="e.g. Wireless Headphones" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Sale Price ($)</label>
                                            <input required type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" placeholder="29" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">MRP ($)</label>
                                            <input required type="number" min="0" value={form.mrp} onChange={e => setForm(f => ({ ...f, mrp: e.target.value }))}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" placeholder="59" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Category</label>
                                            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                                                {categories.map(c => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Stock Status</label>
                                            <select value={form.inStock} onChange={e => setForm(f => ({ ...f, inStock: e.target.value === "true" }))}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                                                <option value="true">In Stock</option>
                                                <option value="false">Out of Stock</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Description</label>
                                        <textarea required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                            placeholder="Describe the product…" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Available Colors</label>
                                        <div className="flex flex-wrap gap-3">
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
                                                        className={`w-7 h-7 rounded-full transition-all flex items-center justify-center shrink-0 ${isSelected ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'ring-1 ring-slate-200 hover:scale-105'}`}
                                                        style={{ backgroundColor: color.hex }}
                                                    >
                                                        {isSelected && (
                                                            <span className="material-symbols-outlined text-white text-sm" style={{ textShadow: '0 0 2px rgba(0,0,0,0.5)' }}>check</span>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    {/* Image section */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Product Images</label>
                                        {form.images?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {form.images.map((img, idx) => (
                                                    <div key={idx} className="relative group size-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                                                        <img src={typeof img === "string" ? img : img?.src || ""} alt="" className="w-full h-full object-cover" />
                                                        <button type="button" onClick={() => removeImage(idx)}
                                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-white text-sm">delete</span>
                                                        </button>
                                                        {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-[9px] font-bold text-center py-0.5">MAIN</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <label className="flex flex-col items-center gap-2 border-2 border-dashed border-slate-200 hover:border-primary/40 bg-slate-50 hover:bg-primary/5 rounded-xl py-5 cursor-pointer transition-all">
                                            <span className="material-symbols-outlined text-slate-400 text-2xl">add_photo_alternate</span>
                                            <p className="text-sm font-semibold text-slate-600">Click to upload images</p>
                                            <p className="text-xs text-slate-400">PNG, JPG, WEBP</p>
                                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-50">Cancel</button>
                                        <button type="submit" className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90">
                                            {editing ? "Save Changes" : "Add Product"}
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
