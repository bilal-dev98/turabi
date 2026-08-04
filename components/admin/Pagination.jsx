'use client'

export default function Pagination({ page, totalPages, onChange }) {
    if (totalPages <= 1) return null

    const pages = []
    const delta = 2
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
            pages.push(i)
        } else if (pages[pages.length - 1] !== '...') {
            pages.push('...')
        }
    }

    return (
        <div className="flex items-center justify-between pt-4 border-t border-zinc-200/80 dark:border-zinc-800 text-xs select-none">
            <p className="text-zinc-500 dark:text-zinc-400">
                Page <span className="font-semibold text-zinc-900 dark:text-white">{page}</span> of <span className="font-semibold text-zinc-900 dark:text-white">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onChange(page - 1)}
                    disabled={page === 1}
                    className="p-1.5 rounded-[4px] text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    title="Previous page"
                >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>

                {pages.map((p, i) =>
                    p === '...' ? (
                        <span key={`ellipsis-${i}`} className="px-1.5 text-zinc-400 dark:text-zinc-600 text-xs">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onChange(p)}
                            className={`min-w-[30px] h-[30px] rounded-[4px] text-xs font-semibold transition-all ${p === page
                                ? 'bg-zinc-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                                : 'text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => onChange(page + 1)}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-[4px] text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    title="Next page"
                >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
            </div>
        </div>
    )
}
