import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AdminProductReviews({ productId, onReviewsUpdated }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [generating, setGenerating] = useState(false);

    // Smart Generator state
    const [reviewCountToGen, setReviewCountToGen] = useState(5);

    // Single Add/Edit Review Form
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [form, setForm] = useState({
        reviewerName: '',
        reviewerImage: '',
        rating: 5,
        review: '',
        createdAt: new Date().toISOString().split('T')[0]
    });

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products/${productId}/reviews`);
            const data = await res.json();
            if (data.success) {
                setReviews(data.data);
                if (onReviewsUpdated) onReviewsUpdated(data.data);
            }
        } catch (error) {
            toast.error("Error fetching reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) fetchReviews();
    }, [productId]);

    // Smart Review Generation Handler
    const handleSmartGenerate = async () => {
        const count = parseInt(reviewCountToGen) || 5;
        setGenerating(true);
        const toastId = toast.loading(`Generating ${count} realistic reviews...`);

        try {
            const res = await fetch(`/api/products/${productId}/generate-reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ count })
            });

            const data = await res.json();
            if (data.success) {
                setReviews(data.data);
                if (onReviewsUpdated) onReviewsUpdated(data.data);
                toast.success(data.message || `Generated ${count} reviews!`, { id: toastId });
            } else {
                toast.error(data.message || "Failed to generate reviews", { id: toastId });
            }
        } catch (error) {
            toast.error("Error generating reviews", { id: toastId });
        } finally {
            setGenerating(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const toastId = toast.loading("Uploading avatar...");

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                setForm(prev => ({ ...prev, reviewerImage: data.url }));
                toast.success("Avatar uploaded!", { id: toastId });
            } else {
                toast.error(`Upload failed: ${data.message}`, { id: toastId });
            }
        } catch (error) {
            toast.error("Error uploading image", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const startEdit = (rev) => {
        setEditingReviewId(rev.id);
        setForm({
            reviewerName: rev.user?.name || rev.reviewerName || '',
            reviewerImage: rev.user?.image || rev.reviewerImage || '',
            rating: rev.rating || 5,
            review: rev.review || '',
            createdAt: rev.createdAt ? new Date(rev.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
    };

    const cancelEdit = () => {
        setEditingReviewId(null);
        setForm({ reviewerName: '', reviewerImage: '', rating: 5, review: '', createdAt: new Date().toISOString().split('T')[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingReviewId) {
            // Update existing review
            const toastId = toast.loading("Updating review...");
            try {
                const res = await fetch(`/api/reviews/${editingReviewId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form)
                });
                const data = await res.json();

                if (data.success) {
                    toast.success("Review updated successfully!", { id: toastId });
                    cancelEdit();
                    fetchReviews();
                } else {
                    toast.error(data.message || "Failed to update review", { id: toastId });
                }
            } catch (error) {
                toast.error("Error updating review", { id: toastId });
            }
        } else {
            // Add new custom review
            const toastId = toast.loading("Adding custom review...");
            try {
                const res = await fetch(`/api/products/${productId}/reviews`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form)
                });
                const data = await res.json();

                if (data.success) {
                    setReviews([data.data, ...reviews]);
                    if (onReviewsUpdated) onReviewsUpdated([data.data, ...reviews]);
                    setForm({ reviewerName: '', reviewerImage: '', rating: 5, review: '', createdAt: new Date().toISOString().split('T')[0] });
                    toast.success("Review added successfully!", { id: toastId });
                } else {
                    toast.error(data.message || "Failed to add review", { id: toastId });
                }
            } catch (error) {
                toast.error("Error adding review", { id: toastId });
            }
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Delete this review?")) return;

        try {
            const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                const updated = reviews.filter(r => r.id !== reviewId);
                setReviews(updated);
                if (onReviewsUpdated) onReviewsUpdated(updated);
                toast.success("Review deleted");
            } else {
                toast.error("Failed to delete review");
            }
        } catch (error) {
            toast.error("Error deleting review");
        }
    };

    if (loading) return <div className="p-4 text-center text-zinc-400 text-sm">Loading reviews...</div>;

    const customReviews = reviews.filter(r => r.isCustom);

    return (
        <div className="space-y-6">
            {/* Smart Review Generator Box */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-lg">auto_awesome</span>
                    <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Smart Review Generator</h3>
                    <span className="ml-auto text-[10px] uppercase tracking-wider font-extrabold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                        Pakistani Dataset
                    </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Instantly generate realistic customer reviews (Roman Urdu, Urdu Unicode, English) with natural 4★–5★ ratings.
                </p>
                <div className="flex items-center gap-3 pt-1">
                    <div className="flex-1 max-w-[160px]">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                            Number of Reviews
                        </label>
                        <select
                            value={reviewCountToGen}
                            onChange={e => setReviewCountToGen(Number(e.target.value))}
                            className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        >
                            {[1, 2, 3, 5, 10, 15, 20, 25, 30, 50, 75, 100].map(n => (
                                <option key={n} value={n}>{n} Reviews</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={handleSmartGenerate}
                        disabled={generating}
                        className="mt-4 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition-all disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-sm">{generating ? "progress_activity" : "bolt"}</span>
                        {generating ? "Generating..." : "Generate Reviews"}
                    </button>
                </div>
            </div>

            {/* Add / Edit Review Form */}
            <form onSubmit={handleSubmit} className="bg-zinc-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-zinc-800 dark:text-white text-sm">
                        {editingReviewId ? "Edit Custom Review" : "Add Manual Review"}
                    </h3>
                    {editingReviewId && (
                        <button type="button" onClick={cancelEdit} className="text-xs font-semibold text-rose-500 hover:underline">
                            Cancel Editing
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Reviewer Name</label>
                        <input required value={form.reviewerName} onChange={e => setForm({ ...form, reviewerName: e.target.value })}
                            className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20"
                            placeholder="e.g. Muhammad Ali" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Rating (1-5)</label>
                        <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
                            className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20">
                            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Review Date</label>
                        <input type="date" required value={form.createdAt} onChange={e => setForm({ ...form, createdAt: e.target.value })}
                            className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Reviewer Image (Optional)</label>
                        <div className="flex items-center gap-3">
                            {form.reviewerImage && (
                                <img src={form.reviewerImage} alt="Avatar" className="size-10 rounded-full object-cover border border-zinc-200 shrink-0" />
                            )}
                            <label className="flex-1 border border-dashed border-slate-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-2">
                                <span className="material-symbols-outlined text-zinc-400 text-sm">upload</span>
                                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                    {uploading ? "Uploading..." : "Upload Avatar"}
                                </span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Review Text</label>
                    <textarea required rows={2} value={form.review} onChange={e => setForm({ ...form, review: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                        placeholder="Great product! Quality boht achi hai..." />
                </div>
                <button type="submit" className="w-full bg-zinc-900 dark:bg-emerald-500 text-white dark:text-slate-950 py-2 rounded-lg font-bold text-xs hover:bg-zinc-800 dark:hover:bg-emerald-400 transition-all">
                    {editingReviewId ? "Update Review" : "Save Review"}
                </button>
            </form>

            {/* Existing Custom Reviews */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-zinc-800 dark:text-white text-sm">
                        Product Reviews ({customReviews.length})
                    </h3>
                </div>
                {customReviews.length === 0 ? (
                    <p className="text-zinc-400 text-xs text-center py-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                        No customer reviews generated yet. Use the Smart Review Generator above!
                    </p>
                ) : (
                    <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                        {customReviews.map(review => (
                            <div key={review.id} className="flex gap-3 p-3.5 border border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-[#121215] shadow-xs relative group items-start">
                                <div className="size-9 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 overflow-hidden border border-emerald-200 dark:border-emerald-800 shrink-0 flex items-center justify-center font-bold text-xs">
                                    {review.user?.image ? (
                                        <img src={review.user.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{(review.user?.name || "C")[0]}</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 pr-12">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-zinc-900 dark:text-white text-xs truncate">{review.user?.name}</h4>
                                        <div className="flex items-center text-amber-400 text-[10px]">
                                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">{review.review}</p>
                                    <span className="text-[10px] text-zinc-400 font-medium block mt-1.5">
                                        {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </span>
                                </div>
                                <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => startEdit(review)}
                                        className="p-1 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-md transition-all" title="Edit review">
                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(review.id)}
                                        className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-all" title="Delete review">
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
