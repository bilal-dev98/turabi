'use client'
import { useState, useEffect } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/admin/messages')
            const data = await res.json()
            if (data.success) setMessages(data.data)
        } catch (error) {
            toast.error("Failed to load messages")
        } finally {
            setLoading(false)
        }
    }

    const toggleRead = async (id, currentStatus) => {
        try {
            const res = await fetch(`/api/admin/messages/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: !currentStatus })
            })
            const data = await res.json()
            if (data.success) {
                setMessages(messages.map(m => m.id === id ? { ...m, isRead: !currentStatus } : m))
                toast.success(data.message)
            }
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    const deleteMessage = async (id) => {
        if (!confirm("Are you sure you want to delete this message?")) return
        try {
            const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (data.success) {
                setMessages(messages.filter(m => m.id !== id))
                toast.success(data.message)
            }
        } catch (error) {
            toast.error("Failed to delete message")
        }
    }

    return (
        <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Contact Messages</h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">View and manage customer inquiries and messages.</p>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1 rounded-[4px] text-xs font-bold hidden sm:block">
                    {messages.length} Total
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                            <tr>
                                {["User", "Contact", "Message", "Date", "Actions"].map(h => (
                                    <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-5 py-12 text-center text-zinc-400 dark:text-zinc-500 text-xs">Loading messages…</td>
                                </tr>
                            ) : messages.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-5 py-12 text-center text-zinc-400 dark:text-zinc-600 text-xs">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <span className="material-symbols-outlined text-3xl opacity-50">inbox</span>
                                            <p>No messages yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : messages.map((msg) => (
                                <tr key={msg.id} className={`hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors ${!msg.isRead ? 'bg-emerald-50/30 dark:bg-emerald-950/10' : ''}`}>
                                    <td className="px-5 py-3 relative">
                                        {!msg.isRead && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-500 rounded-r-full" />}
                                        <div className="text-xs font-semibold text-zinc-900 dark:text-white">{msg.name}</div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex flex-col gap-0.5 text-[11px]">
                                            <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300"><span className="material-symbols-outlined text-xs">mail</span> {msg.email}</span>
                                            {msg.phone && <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400"><span className="material-symbols-outlined text-xs">call</span> {msg.phone}</span>}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="max-w-xs md:max-w-md truncate text-xs text-zinc-600 dark:text-zinc-300 whitespace-normal line-clamp-2" title={msg.message}>
                                            {msg.message}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                                        {format(new Date(msg.createdAt), "MMM d, yyyy h:mm a")}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => toggleRead(msg.id, msg.isRead)}
                                                className={`p-1.5 rounded-[4px] transition-all ${msg.isRead ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30' : 'text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                                                title={msg.isRead ? "Mark as unread" : "Mark as read"}
                                            >
                                                <span className="material-symbols-outlined text-sm">{msg.isRead ? 'mark_email_read' : 'mail'}</span>
                                            </button>
                                            <button
                                                onClick={() => deleteMessage(msg.id)}
                                                className="p-1.5 rounded-[4px] text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                                                title="Delete message"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
