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

const COLORS = ["bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400", "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400", "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400", "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400", "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400", "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400"]

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

    if (loading) return <div className="p-8 flex items-center gap-3 text-zinc-400 dark:text-zinc-500 text-sm"><span className="material-symbols-outlined animate-spin text-emerald-500">progress_activity</span>Loading categories…</div>

    return (
        <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Categories</h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{categories.length} total categories</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Add Category Form */}
                <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-5 shadow-xs flex flex-col gap-4 h-fit">
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Add New Category</h2>
                    <form onSubmit={handleAdd} className="space-y-3">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Category Name</label>
                            <input
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="e.g. Laptops"
                                className="w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            />
                        </div>
                        <button type="submit" className="w-full bg-zinc-900 dark:bg-emerald-500 text-white dark:text-slate-950 py-2 rounded-[4px] font-semibold text-xs shadow-xs hover:bg-zinc-800 dark:hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add Category
                        </button>
                    </form>

                    <div className="border-t border-slate-100 dark:border-zinc-800 pt-3">
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Categories help customers discover products easily.</p>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {categories.map(cat => (
                        <div key={cat.id} className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-4 shadow-xs flex items-center gap-3.5 group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                            <div className={`size-10 rounded-[4px] ${cat.color} flex items-center justify-center shrink-0`}>
                                <span className="material-symbols-outlined text-base">{cat.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                {editingId === cat.id ? (
                                    <div className="flex items-center gap-1.5">
                                        <input
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && saveEdit(cat.id)}
                                            autoFocus
                                            className="flex-1 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-2 py-1 text-xs text-zinc-900 dark:text-zinc-100 outline-none"
                                        />
                                        <button onClick={() => saveEdit(cat.id)} className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-[4px] transition-all">
                                            <span className="material-symbols-outlined text-sm">check</span>
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[4px] transition-all">
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="font-semibold text-zinc-900 dark:text-white text-xs">{cat.name}</p>
                                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">{cat.productCount} products</p>
                                    </>
                                )}
                            </div>
                            {editingId !== cat.id && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => startEdit(cat)} className="p-1.5 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-[4px] transition-all">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-[4px] transition-all">
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
