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
        if (!confirm("Are you sure you want to delete this message?")) return;
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
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Contact Messages</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage messages from your customers.</p>
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl font-bold text-sm hidden sm:block">
                    {messages.length} Total
                </div>
            </div>

            <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl p-1 border border-slate-100 dark:border-white/5 shadow-2xl shadow-primary/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-white/5">
                            <tr>
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Contact</th>
                                <th className="px-6 py-4 font-semibold">Message</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">Loading messages...</td>
                                </tr>
                            ) : messages.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                                            <p>No messages yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : messages.map((msg) => (
                                <tr key={msg.id} className={`group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${!msg.isRead ? 'bg-primary/5 dark:bg-primary/5' : ''}`}>
                                    <td className="px-6 py-4 relative">
                                        {!msg.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"></div>}
                                        <div className="font-semibold text-slate-900 dark:text-white">{msg.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-xs">
                                            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-[14px]">mail</span> {msg.email}</span>
                                            {msg.phone && <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-[14px]">call</span> {msg.phone}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-xs md:max-w-md lg:max-w-xl truncate text-slate-600 dark:text-slate-400 whitespace-normal line-clamp-2" title={msg.message}>
                                            {msg.message}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                        {format(new Date(msg.createdAt), "MMM d, yyyy h:mm a")}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => toggleRead(msg.id, msg.isRead)}
                                                className={`p-2 rounded-xl border transition-all ${msg.isRead ? 'border-primary/20 text-primary bg-primary/10' : 'border-slate-200 dark:border-white/10 text-slate-400 hover:text-primary hover:border-primary/30'}`}
                                                title={msg.isRead ? "Mark as unread" : "Mark as read"}
                                            >
                                                <span className="material-symbols-outlined text-sm">{msg.isRead ? 'mark_email_read' : 'mail'}</span>
                                            </button>
                                            <button
                                                onClick={() => deleteMessage(msg.id)}
                                                className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
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
