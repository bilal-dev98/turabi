'use client'
import { useEffect, useState } from "react"
import { categories as defaultCategories } from "@/assets/assets"
import toast from "react-hot-toast"

const CATEGORY_ICONS = {
    Headphones: "headphones",
    Speakers: "speaker",
    Watch: "watch",
    Earbuds: "earbuds",
    Mouse: "mouse",
    Decoration: "home",
    Camera: "photo_camera",
    Theater: "tv",
    Pen: "edit",
    Cleaner: "star"
}

const COLORS = ["bg-primary/10", "bg-blue-100", "bg-purple-100", "bg-amber-100", "bg-red-100", "bg-emerald-100"]

export default function AdminCategories() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [newName, setNewName] = useState("")
    const [editingId, setEditingId] = useState(null)
    const [editName, setEditName] = useState("")

    useEffect(() => {
        const cats = defaultCategories.map((name, i) => ({
            id: `cat_${i + 1}`,
            name,
            icon: CATEGORY_ICONS[name] || "category",
            color: COLORS[i % COLORS.length],
            productCount: Math.floor(Math.random() * 30) + 2
        }))
        setCategories(cats)
        setLoading(false)
    }, [])

    const handleAdd = (e) => {
        e.preventDefault()
        if (!newName.trim()) return
        if (categories.some(c => c.name.toLowerCase() === newName.toLowerCase())) {
            toast.error("Category already exists!")
            return
        }
        const newCat = { id: `cat_${Date.now()}`, name: newName.trim(), icon: "category", color: COLORS[categories.length % COLORS.length], productCount: 0 }
        setCategories(prev => [...prev, newCat])
        setNewName("")
        toast.success("Category added!")
    }

    const handleDelete = (id) => {
        toast.promise(
            new Promise(res => setTimeout(() => { setCategories(p => p.filter(c => c.id !== id)); res() }, 300)),
            { loading: "Deleting...", success: "Category deleted!", error: "Failed" }
        )
    }

    const startEdit = (cat) => { setEditingId(cat.id); setEditName(cat.name) }
    const saveEdit = (id) => {
        if (!editName.trim()) return
        setCategories(prev => prev.map(c => c.id === id ? { ...c, name: editName.trim() } : c))
        setEditingId(null)
        toast.success("Category updated!")
    }

    if (loading) return <div className="p-10 text-slate-400">Loading...</div>

    return (
        <div className="p-10 max-w-7xl mx-auto w-full space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Categories <span className="text-slate-400 font-medium">Management</span></h1>
                    <p className="text-sm text-slate-500 mt-1">{categories.length} total categories</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add Category Form */}
                <div className="bg-white rounded-2xl p-6 shadow-sm shadow-primary/5 border border-primary/5 flex flex-col gap-4 h-fit">
                    <h2 className="text-base font-bold text-slate-900">Add New Category</h2>
                    <form onSubmit={handleAdd} className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Category Name</label>
                            <input
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="e.g. Laptops"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                            />
                        </div>
                        <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add Category
                        </button>
                    </form>

                    <div className="mt-4 border-t border-slate-100 pt-4">
                        <p className="text-xs text-slate-400 font-medium">Categories help customers discover products easily.</p>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map(cat => (
                        <div key={cat.id} className="bg-white rounded-2xl p-5 shadow-sm shadow-primary/5 border border-primary/5 flex items-center gap-4 group hover:shadow-md transition-all">
                            <div className={`size-12 rounded-xl ${cat.color} flex items-center justify-center shrink-0`}>
                                <span className="material-symbols-outlined text-slate-600">{cat.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                {editingId === cat.id ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && saveEdit(cat.id)}
                                            autoFocus
                                            className="flex-1 bg-slate-50 border border-primary/30 rounded-lg px-2 py-1 text-sm text-slate-800 outline-none"
                                        />
                                        <button onClick={() => saveEdit(cat.id)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-all">
                                            <span className="material-symbols-outlined text-sm">check</span>
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-all">
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="font-semibold text-slate-900 text-sm">{cat.name}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{cat.productCount} products</p>
                                    </>
                                )}
                            </div>
                            {editingId !== cat.id && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => startEdit(cat)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
