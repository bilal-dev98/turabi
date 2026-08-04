'use client'
import { useEffect, useState, useMemo } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal"
import { exportToCSV } from "@/lib/csvExport"

export default function AdminNewsletter() {
    const [subscribers, setSubscribers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [deleteTarget, setDeleteTarget] = useState(null)

    const fetchSubscribers = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/newsletter')
            const data = await res.json()
            if (data.success) {
                setSubscribers(data.data)
            } else {
                toast.error("Failed to load subscribers")
            }
        } catch (error) {
            toast.error("Connection error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubscribers()
    }, [])

    const filtered = useMemo(() =>
        subscribers.filter(s => s.email.toLowerCase().includes(search.toLowerCase())),
        [subscribers, search]
    )

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/admin/newsletter/${deleteTarget.id}`, { method: 'DELETE' })
            const data = await res.json()
            if (data.success) {
                toast.success("Subscriber removed!")
                fetchSubscribers()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Connection error")
        } finally {
            setDeleteTarget(null)
        }
    }

    const handleExport = () => {
        const rows = filtered.map(s => ({
            Email: s.email,
            "Subscribed On": format(new Date(s.subscribedAt), "yyyy-MM-dd HH:mm")
        }))
        exportToCSV(rows, "newsletter-subscribers")
        toast.success("Exported as newsletter-subscribers.csv")
    }

    if (loading) return <div className="p-10 text-zinc-400">Loading subscribers...</div>

    return (
        <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900">
                        Newsletter <span className="text-zinc-400 font-medium">&amp; Subscribers</span>
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">{subscribers.length} total subscribers</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 border border-zinc-200 text-zinc-600 px-4 py-2 rounded-[4px] text-sm font-semibold hover:bg-zinc-50 transition-all"
                >
                    <span className="material-symbols-outlined text-sm">download</span>
                    Export CSV
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-[4px] p-5 border border-primary/5 shadow-sm shadow-primary/5 flex items-center gap-4">
                    <div className="size-10 rounded-[4px] bg-green-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-600 text-[20px]">mail</span>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-900">{subscribers.length}</p>
                        <p className="text-xs text-zinc-500 font-medium">Total Subscribers</p>
                    </div>
                </div>
                <div className="bg-white rounded-[4px] p-5 border border-primary/5 shadow-sm shadow-primary/5 flex items-center gap-4">
                    <div className="size-10 rounded-[4px] bg-blue-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#4799eb] text-[20px]">today</span>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-900">
                            {subscribers.filter(s => {
                                const d = new Date(s.subscribedAt)
                                const now = new Date()
                                return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
                            }).length}
                        </p>
                        <p className="text-xs text-zinc-500 font-medium">Joined Today</p>
                    </div>
                </div>
                <div className="bg-white rounded-[4px] p-5 border border-primary/5 shadow-sm shadow-primary/5 flex items-center gap-4">
                    <div className="size-10 rounded-[4px] bg-purple-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-600 text-[20px]">calendar_month</span>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-900">
                            {subscribers.filter(s => {
                                const d = new Date(s.subscribedAt)
                                const now = new Date()
                                const diff = (now - d) / (1000 * 60 * 60 * 24)
                                return diff <= 30
                            }).length}
                        </p>
                        <p className="text-xs text-zinc-500 font-medium">Joined This Month</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-[4px] px-5 py-3.5 shadow-sm shadow-primary/5 border border-primary/5 flex items-center gap-3">
                <span className="material-symbols-outlined text-zinc-400 text-sm">search</span>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by email…"
                    className="flex-1 bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
                />
                {search && (
                    <button type="button" onClick={() => setSearch('')} className="text-zinc-400 hover:text-zinc-600">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                )}
            </div>

            {/* Subscribers Table */}
            <div className="bg-white rounded-[4px] shadow-sm shadow-primary/5 border border-primary/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-zinc-50/50 border-b border-slate-100 text-[11px] uppercase tracking-widest font-bold text-zinc-400">
                                <th className="px-5 py-4">#</th>
                                <th className="px-5 py-4">Email Address</th>
                                <th className="px-5 py-4">Subscribed On</th>
                                <th className="px-5 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center text-zinc-400 text-sm">
                                        {search ? 'No subscribers match your search.' : 'No subscribers yet. Share your newsletter!'}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((sub, index) => (
                                    <tr key={sub.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-5 py-3.5 text-zinc-400 font-mono text-xs">{index + 1}</td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center text-xs font-bold text-green-600">
                                                    {sub.email.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-zinc-800">{sub.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-zinc-500">
                                            {format(new Date(sub.subscribedAt), "MMM d, yyyy 'at' h:mm a")}
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <button
                                                onClick={() => setDeleteTarget(sub)}
                                                className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-[4px] transition-all"
                                                title="Remove subscriber"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DeleteConfirmModal
                open={!!deleteTarget}
                title={`Remove ${deleteTarget?.email}?`}
                description="This subscriber will be permanently removed from your newsletter list."
                confirmLabel="Remove Subscriber"
                danger={true}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    )
}
