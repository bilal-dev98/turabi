'use client'
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const PLATFORM_METADATA = [
    { key: "facebook", name: "Facebook", icon: "facebook", placeholder: "https://facebook.com/yourpage", color: "from-blue-600 to-indigo-600" },
    { key: "instagram", name: "Instagram", icon: "photo_camera", placeholder: "https://instagram.com/yourhandle", color: "from-pink-500 via-rose-500 to-amber-500" },
    { key: "whatsapp", name: "WhatsApp", icon: "chat", placeholder: "https://wa.me/923001234567", color: "from-emerald-500 to-teal-600" },
    { key: "twitter", name: "Twitter / X", icon: "tag", placeholder: "https://x.com/yourhandle", color: "from-slate-700 to-slate-900" },
    { key: "youtube", name: "YouTube", icon: "play_circle", placeholder: "https://youtube.com/@yourchannel", color: "from-red-600 to-rose-700" },
    { key: "tiktok", name: "TikTok", icon: "music_note", placeholder: "https://tiktok.com/@yourhandle", color: "from-slate-900 via-zinc-900 to-cyan-700" },
    { key: "linkedin", name: "LinkedIn", icon: "work", placeholder: "https://linkedin.com/company/yourcompany", color: "from-blue-700 to-sky-700" },
    { key: "pinterest", name: "Pinterest", icon: "push_pin", placeholder: "https://pinterest.com/yourprofile", color: "from-red-500 to-pink-600" },
]

export default function AdminSocialLinks() {
    const [socialLinks, setSocialLinks] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const fetchSocialLinks = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/social-links')
            const data = await res.json()
            if (data.success) {
                const map = {}
                data.data.forEach(item => {
                    map[item.platform.toLowerCase()] = {
                        url: item.url || "",
                        isActive: item.isActive ?? true
                    }
                })
                setSocialLinks(map)
            } else {
                toast.error("Failed to load social links")
            }
        } catch (err) {
            toast.error("Error connecting to server")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSocialLinks()
    }, [])

    const handleUrlChange = (platformKey, url) => {
        setSocialLinks(prev => ({
            ...prev,
            [platformKey]: {
                url,
                isActive: prev[platformKey]?.isActive ?? true
            }
        }))
    }

    const handleToggleActive = (platformKey) => {
        setSocialLinks(prev => ({
            ...prev,
            [platformKey]: {
                url: prev[platformKey]?.url || "",
                isActive: !prev[platformKey]?.isActive
            }
        }))
    }

    const formatUrlProtocol = (input) => {
        if (!input) return "";
        const trimmed = input.trim();
        if (!trimmed) return "";
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")) {
            return trimmed;
        }
        return `https://${trimmed}`;
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)

        const payload = PLATFORM_METADATA.map(p => ({
            platform: p.key,
            url: formatUrlProtocol(socialLinks[p.key]?.url || ""),
            isActive: socialLinks[p.key]?.isActive ?? true
        }))

        try {
            const res = await fetch('/api/admin/social-links', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ links: payload })
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Social links updated & synced across website!")
                fetchSocialLinks()
            } else {
                toast.error(data.message || "Failed to update social links")
            }
        } catch (err) {
            toast.error("Error saving social links")
        } finally {
            setSaving(false)
        }
    }

    const activeCount = Object.values(socialLinks).filter(s => s?.isActive && s?.url?.trim() !== "").length

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh] text-zinc-500 text-sm">
                <span className="material-symbols-outlined animate-spin text-emerald-500 text-2xl mr-3">progress_activity</span>
                Loading Social Links settings…
            </div>
        )
    }

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 antialiased">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
                        <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-3xl">share</span>
                        Social Media & Contact Links
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Manage all social profiles. Changes automatically reflect across Footer, Contact Page, About Page & Header.
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                    {saving ? (
                        <>
                            <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                            <span>Saving Changes…</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-base">save</span>
                            <span>Save & Sync Website</span>
                        </>
                    )}
                </button>
            </div>

            {/* Active Links Banner Stats */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-2xl">verified</span>
                    <div>
                        <p className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                            {activeCount} Active Social Channels
                        </p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400">
                            Enabled links will be dynamically displayed on the store frontend.
                        </p>
                    </div>
                </div>
            </div>

            {/* Social Links Cards Grid */}
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PLATFORM_METADATA.map((p) => {
                    const currentData = socialLinks[p.key] || { url: "", isActive: true }
                    return (
                        <div
                            key={p.key}
                            className={`p-5 rounded-2xl border transition-all bg-white dark:bg-zinc-900 shadow-xs flex flex-col justify-between space-y-4 ${
                                currentData.isActive
                                    ? "border-zinc-200 dark:border-zinc-800"
                                    : "border-zinc-200/50 dark:border-zinc-800/40 opacity-60 bg-zinc-50 dark:bg-zinc-950"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-xl bg-gradient-to-br ${p.color} text-white flex items-center justify-center shadow-xs`}>
                                        <span className="material-symbols-outlined text-xl">{p.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-zinc-900 dark:text-white">{p.name}</h3>
                                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                            {currentData.isActive ? "Visible on site" : "Hidden from site"}
                                        </p>
                                    </div>
                                </div>

                                {/* Active Toggle */}
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={currentData.isActive}
                                        onChange={() => handleToggleActive(p.key)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-hidden rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:border-zinc-600 peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>

                            {/* URL Input */}
                            <div>
                                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                                    Profile / Page URL
                                </label>
                                <input
                                    type="url"
                                    value={currentData.url}
                                    onChange={(e) => handleUrlChange(p.key, e.target.value)}
                                    placeholder={p.placeholder}
                                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-400"
                                />
                            </div>
                        </div>
                    )
                })}

                {/* Bottom Save Bar */}
                <div className="md:col-span-2 flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? "Saving Changes…" : "Save All Social Links"}
                    </button>
                </div>
            </form>
        </div>
    )
}
