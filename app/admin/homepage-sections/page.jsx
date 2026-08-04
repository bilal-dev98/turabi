'use client'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Loading from '@/components/Loading'
import Image from 'next/image'
import { useSelector } from 'react-redux'

const AdminHomePageSections = () => {
    const [sections, setSections] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const products = useSelector(state => state.product.list) || []

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const res = await fetch('/api/admin/homepage-sections')
                const data = await res.json()
                if (data.success) {
                    setSections(data.data)
                }
            } catch (error) {
                console.error("Error fetching sections:", error)
                toast.error("Failed to load sections.")
            } finally {
                setLoading(false)
            }
        }
        fetchSections()
    }, [])

    const handleTitleChange = (identifier, newTitle) => {
        setSections(prev => prev.map(sec => sec.identifier === identifier ? { ...sec, title: newTitle } : sec))
    }

    const handleAddProduct = (identifier, productId) => {
        setSections(prev => prev.map(sec => {
            if (sec.identifier === identifier && !sec.productIds.includes(productId)) {
                return { ...sec, productIds: [...sec.productIds, productId] }
            }
            return sec
        }))
    }

    const handleRemoveProduct = (identifier, productId) => {
        setSections(prev => prev.map(sec => {
            if (sec.identifier === identifier) {
                return { ...sec, productIds: sec.productIds.filter(id => id !== productId) }
            }
            return sec
        }))
    }

    const handleSave = async (section) => {
        setSaving(true)
        try {
            const res = await fetch('/api/admin/homepage-sections', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier: section.identifier,
                    title: section.title,
                    productIds: section.productIds
                })
            })
            const data = await res.json()
            if (data.success) {
                toast.success(`${section.title} updated successfully`)
            } else {
                toast.error(data.message || "Failed to update section")
            }
        } catch (error) {
            toast.error("An error occurred while saving")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <Loading />

    return (
        <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Homepage Sections</h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Customize curated product collections showcased on your main storefront.</p>
            </div>

            <div className="space-y-6">
                {sections.map((section) => (
                    <div key={section.identifier} className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 p-5 rounded-[4px] shadow-xs space-y-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1 max-w-md">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                                    Section Title ({section.identifier})
                                </label>
                                <input
                                    type="text"
                                    value={section.title}
                                    onChange={(e) => handleTitleChange(section.identifier, e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all"
                                />
                            </div>
                            <button
                                onClick={() => handleSave(section)}
                                disabled={saving}
                                className="bg-zinc-900 dark:bg-emerald-500 text-white dark:text-slate-950 px-4 py-2 rounded-[4px] font-semibold text-xs shadow-xs hover:bg-zinc-800 dark:hover:bg-emerald-400 transition-all"
                            >
                                {saving ? "Saving…" : "Save Changes"}
                            </button>
                        </div>

                        {/* Product assignment */}
                        <div className="border-t border-slate-100 dark:border-zinc-800 pt-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
                                Assigned Products ({section.productIds.length})
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Assigned Products List */}
                                <div className="bg-zinc-50 dark:bg-zinc-800/30 p-3 rounded-[4px] h-72 overflow-y-auto border border-zinc-200 dark:border-zinc-800 custom-scrollbar">
                                    {section.productIds.length === 0 ? (
                                        <p className="text-zinc-400 dark:text-zinc-500 text-xs italic py-4 text-center">No products assigned yet.</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {section.productIds.map(pId => {
                                                const product = products.find(p => p.id === pId)
                                                return (
                                                    <li key={pId} className="flex items-center justify-between bg-white dark:bg-zinc-900 p-2.5 rounded-[4px] border border-zinc-200 dark:border-zinc-800">
                                                        <div className="flex flex-1 items-center gap-2.5 min-w-0">
                                                            {product?.images?.[0] ? (
                                                                <Image src={product.images[0]} alt={product.name} width={32} height={32} className="rounded-[4px] object-cover size-8 shrink-0" />
                                                            ) : (
                                                                <div className="size-8 bg-zinc-100 dark:bg-zinc-800 rounded-[4px] shrink-0"></div>
                                                            )}
                                                            <span className="text-xs font-semibold truncate text-zinc-800 dark:text-zinc-200">
                                                                {product ? product.name : `Product ID: ${pId}`}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveProduct(section.identifier, pId)}
                                                            className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-1 rounded-[4px] transition-all shrink-0 ml-2"
                                                            title="Remove"
                                                        >
                                                            <span className="material-symbols-outlined text-base">delete</span>
                                                        </button>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    )}
                                </div>

                                {/* Available Products List */}
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Available Products</h4>
                                    <div className="bg-zinc-50 dark:bg-zinc-800/30 p-3 rounded-[4px] h-64 overflow-y-auto border border-zinc-200 dark:border-zinc-800 custom-scrollbar">
                                        <ul className="space-y-1.5">
                                            {products.filter(p => !section.productIds.includes(p.id)).slice(0, 50).map(product => (
                                                <li key={product.id} className="flex items-center justify-between p-2 hover:bg-white dark:hover:bg-zinc-900 rounded-[4px] group transition-colors">
                                                    <div className="flex flex-1 items-center gap-2 min-w-0">
                                                        {product?.images?.[0] && (
                                                            <Image src={product.images[0]} alt={product.name} width={28} height={28} className="rounded-[4px] object-cover size-7 shrink-0" />
                                                        )}
                                                        <span className="text-xs text-zinc-700 dark:text-zinc-300 truncate">{product.name}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddProduct(section.identifier, product.id)}
                                                        className="text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-[4px] shrink-0 ml-2"
                                                        title="Add"
                                                    >
                                                        <span className="material-symbols-outlined text-base">add_circle</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1.5">* Showing top available products.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminHomePageSections
