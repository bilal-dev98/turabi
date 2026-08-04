'use client'

export default function DeleteConfirmModal({ open, title = "Delete this item?", description = "This action cannot be undone.", confirmLabel = "Delete", onConfirm, onCancel, danger = true }) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150" onClick={onCancel}>
            <div
                className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] shadow-xl w-full max-w-sm p-6 space-y-4 animate-in zoom-in-95 duration-150"
                onClick={e => e.stopPropagation()}
            >
                {/* Icon */}
                <div className={`size-11 rounded-[4px] flex items-center justify-center mx-auto ${danger ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'}`}>
                    <span className="material-symbols-outlined text-xl">
                        {danger ? 'delete_forever' : 'warning'}
                    </span>
                </div>

                {/* Text */}
                <div className="text-center">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">{title}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{description}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 pt-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 border border-slate-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 py-2 rounded-[4px] text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-2 rounded-[4px] text-xs font-semibold text-white transition-all shadow-xs ${danger
                                ? 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600'
                                : 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600'
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
