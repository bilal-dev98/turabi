'use client'

export default function DeleteConfirmModal({ open, title = "Delete this item?", description = "This action cannot be undone.", confirmLabel = "Delete", onConfirm, onCancel, danger = true }) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onCancel}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4"
                onClick={e => e.stopPropagation()}
            >
                {/* Icon */}
                <div className={`size-12 rounded-2xl flex items-center justify-center mx-auto ${danger ? 'bg-red-100' : 'bg-amber-100'}`}>
                    <span className={`material-symbols-outlined text-xl ${danger ? 'text-red-500' : 'text-amber-600'}`}>
                        {danger ? 'delete_forever' : 'warning'}
                    </span>
                </div>

                {/* Text */}
                <div className="text-center">
                    <h3 className="text-base font-bold text-slate-900">{title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{description}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                    <button
                        onClick={onCancel}
                        className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-lg ${danger
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-200'
                                : 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
