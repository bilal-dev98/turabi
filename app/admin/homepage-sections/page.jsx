'use client'
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';
import Image from 'next/image';
import { useSelector } from 'react-redux';

const AdminHomePageSections = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Use Redux for products
    const products = useSelector(state => state.product.list) || [];

    // Fetch sections
    useEffect(() => {
        const fetchSections = async () => {
            try {
                const res = await fetch('/api/admin/homepage-sections');
                const data = await res.json();
                if (data.success) {
                    setSections(data.data);
                }
            } catch (error) {
                console.error("Error fetching sections:", error);
                toast.error("Failed to load sections.");
            } finally {
                setLoading(false);
            }
        };
        fetchSections();
    }, []);

    const handleTitleChange = (identifier, newTitle) => {
        setSections(prev => prev.map(sec => sec.identifier === identifier ? { ...sec, title: newTitle } : sec));
    };

    const handleAddProduct = (identifier, productId) => {
        setSections(prev => prev.map(sec => {
            if (sec.identifier === identifier && !sec.productIds.includes(productId)) {
                return { ...sec, productIds: [...sec.productIds, productId] };
            }
            return sec;
        }));
    };

    const handleRemoveProduct = (identifier, productId) => {
        setSections(prev => prev.map(sec => {
            if (sec.identifier === identifier) {
                return { ...sec, productIds: sec.productIds.filter(id => id !== productId) };
            }
            return sec;
        }));
    };

    const handleSave = async (section) => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/homepage-sections', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier: section.identifier,
                    title: section.title,
                    productIds: section.productIds
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`${section.title} updated successfully`);
            } else {
                toast.error(data.message || "Failed to update section");
            }
        } catch (error) {
            toast.error("An error occurred while saving");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="p-6 max-w-7xl mx-auto w-full">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Home Page Sections</h1>

            <div className="space-y-10">
                {sections.map((section) => (
                    <div key={section.identifier} className="bg-white dark:bg-[#181818] p-6 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Section Title ({section.identifier})
                                </label>
                                <input
                                    type="text"
                                    value={section.title}
                                    onChange={(e) => handleTitleChange(section.identifier, e.target.value)}
                                    className="w-full max-w-md bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 dark:text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none"
                                />
                            </div>
                            <button
                                onClick={() => handleSave(section)}
                                disabled={saving}
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl font-medium transition"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>

                        {/* Product assignment */}
                        <div className="mt-6 border-t border-slate-100 dark:border-white/5 pt-6">
                            <h3 className="text-md font-semibold mb-4 dark:text-white">Assigned Products ({section.productIds.length})</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Assigned Products List */}
                                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl h-80 overflow-y-auto border border-slate-100 dark:border-white/5">
                                    {section.productIds.length === 0 ? (
                                        <p className="text-slate-500 text-sm italic">No products assigned yet.</p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {section.productIds.map(pId => {
                                                const product = products.find(p => p.id === pId);
                                                return (
                                                    <li key={pId} className="flex items-center justify-between bg-white dark:bg-[#1a1a1a] p-3 rounded-lg border border-slate-100 dark:border-white/5">
                                                        <div className="flex flex-1 items-center gap-3">
                                                            {product?.images?.[0] ? (
                                                                <Image src={product.images[0]} alt={product.name} width={40} height={40} className="rounded-md object-cover w-auto h-auto" />
                                                            ) : (
                                                                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-md shrink-0"></div>
                                                            )}
                                                            <span className="text-sm font-medium line-clamp-1 truncate overflow-hidden dark:text-slate-200">
                                                                {product ? product.name : `Product ID: ${pId}`}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveProduct(section.identifier, pId)}
                                                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-1.5 rounded-lg transition ml-2 shrink-0"
                                                            title="Remove"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>

                                {/* Available Products List */}
                                <div>
                                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Available Products</h4>
                                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl h-72 overflow-y-auto border border-slate-100 dark:border-white/5">
                                        <ul className="space-y-2">
                                            {products.filter(p => !section.productIds.includes(p.id)).slice(0, 50).map(product => (
                                                <li key={product.id} className="flex items-center justify-between p-2 hover:bg-white dark:hover:bg-[#1a1a1a] rounded-lg group transition">
                                                    <div className="flex flex-1 items-center gap-3">
                                                        {product?.images?.[0] && (
                                                            <Image src={product.images[0]} alt={product.name} width={30} height={30} className="rounded-md object-cover md:hidden lg:block shrink-0 w-auto h-auto" />
                                                        )}
                                                        <span className="text-sm truncate overflow-hidden dark:text-slate-200">{product.name}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddProduct(section.identifier, product.id)}
                                                        className="text-primary opacity-0 group-hover:opacity-100 transition ml-2 shrink-0"
                                                        title="Add"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">* Showing top available products.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminHomePageSections;
