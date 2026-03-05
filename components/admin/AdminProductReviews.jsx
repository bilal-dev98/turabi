import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AdminProductReviews({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                setForm({ reviewerName: '', reviewerImage: '', rating: 5, review: '', createdAt: new Date().toISOString().split('T')[0] });
                toast.success("Review added successfully!", { id: toastId });
            } else {
                toast.error(data.message || "Failed to add review", { id: toastId });
            }
        } catch (error) {
            toast.error("Error adding review", { id: toastId });
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Delete this review?")) return;

        try {
            const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                setReviews(reviews.filter(r => r.id !== reviewId));
                toast.success("Review deleted");
            } else {
                toast.error("Failed to delete review");
            }
        } catch (error) {
            toast.error("Error deleting review");
        }
    };

    if (loading) return <div className="p-4 text-center text-slate-400 text-sm">Loading reviews...</div>;

    return (
        <div className="space-y-6">
            {/* Add New Review Form */}
            <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-slate-800 text-sm">Add Custom Review</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Reviewer Name</label>
                        <input required value={form.reviewerName} onChange={e => setForm({ ...form, reviewerName: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="e.g. John Doe" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Rating (1-5)</label>
                        <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Review Date</label>
                        <input type="date" required value={form.createdAt} onChange={e => setForm({ ...form, createdAt: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Reviewer Image (Optional)</label>
                        <div className="flex items-center gap-3">
                            {form.reviewerImage && (
                                <img src={form.reviewerImage} alt="Avatar" className="size-12 rounded-full object-cover border border-slate-200 shrink-0" />
                            )}
                            <label className="flex-1 border border-dashed border-slate-300 rounded-lg px-3 py-2 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400 text-sm">upload</span>
                                <span className="text-sm font-medium text-slate-600">
                                    {uploading ? "Uploading..." : "Upload Avatar"}
                                </span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Review Text</label>
                    <textarea required rows={2} value={form.review} onChange={e => setForm({ ...form, review: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        placeholder="Great product! I loved it..." />
                </div>
                <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all">
                    Save Review
                </button>
            </form>

            {/* Existing Reviews */}
            <div className="space-y-3">
                <h3 className="font-bold text-slate-800 text-sm">Existing Custom Reviews ({reviews.filter(r => r.isCustom).length})</h3>
                {
                    reviews.filter(r => r.isCustom).length === 0 && (
                        <p className="text-slate-400 text-sm text-center py-4 border border-dashed border-slate-200 rounded-xl">No custom reviews yet.</p>
                    )
                }
                {
                    reviews.filter(r => r.isCustom).map(review => (
                        <div key={review.id} className="flex gap-4 p-4 border border-slate-100 rounded-xl bg-white shadow-sm shadow-slate-100 relative group">
                            <div className="size-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center">
                                {review.user?.image ? (
                                    <img src={review.user.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-symbols-outlined text-slate-400">person</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-slate-800 text-sm">{review.user?.name}</h4>
                                    <div className="flex items-center text-amber-400 text-xs">
                                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{review.review}</p>
                                <span className="text-[10px] text-slate-400 font-medium block mt-2">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <button onClick={() => handleDelete(review.id)}
                                className="absolute right-2 top-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                        </div>
                    ))
                }
            </div >
        </div >
    );
}
