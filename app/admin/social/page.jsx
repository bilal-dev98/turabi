'use client'
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const FacebookSvg = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
)

const InstagramSvg = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
)

const WhatsappSvg = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
)

const TwitterSvg = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
)

const YoutubeSvg = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
)

const TiktokSvg = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.53-1.37 1.43-1.47 2.41-.12 1.09.28 2.19 1.03 2.95.84.88 2.12 1.27 3.31.97 1.04-.24 1.95-.98 2.37-1.95.32-.7.44-1.49.43-2.26.02-4.96.01-9.92.01-14.88z" />
    </svg>
)

const LinkedinSvg = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
)

const PinterestSvg = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"/>
    </svg>
)

const PLATFORM_METADATA = [
    { key: "facebook", name: "Facebook", domain: "facebook.com", svg: FacebookSvg, placeholder: "https://facebook.com/chandjewelry.store", colorClass: "text-[#1877F2] bg-[#1877F2]/10 dark:bg-[#1877F2]/20" },
    { key: "instagram", name: "Instagram", domain: "instagram.com", svg: InstagramSvg, placeholder: "https://instagram.com/chandjewelry.store", colorClass: "text-[#E4405F] bg-[#E4405F]/10 dark:bg-[#E4405F]/20" },
    { key: "whatsapp", name: "WhatsApp", domain: "wa.me", svg: WhatsappSvg, placeholder: "https://wa.me/923255821056", colorClass: "text-[#25D366] bg-[#25D366]/10 dark:bg-[#25D366]/20" },
    { key: "twitter", name: "Twitter / X", domain: "x.com", svg: TwitterSvg, placeholder: "https://x.com/chandjewelry", colorClass: "text-zinc-900 dark:text-white bg-zinc-200 dark:bg-zinc-800" },
    { key: "youtube", name: "YouTube", domain: "youtube.com", svg: YoutubeSvg, placeholder: "https://youtube.com/@chandjewelry", colorClass: "text-[#FF0000] bg-[#FF0000]/10 dark:bg-[#FF0000]/20" },
    { key: "tiktok", name: "TikTok", domain: "tiktok.com", svg: TiktokSvg, placeholder: "https://tiktok.com/@chandjewelry", colorClass: "text-zinc-900 dark:text-white bg-zinc-200 dark:bg-zinc-800" },
    { key: "linkedin", name: "LinkedIn", domain: "linkedin.com", svg: LinkedinSvg, placeholder: "https://linkedin.com/company/chandjewelry", colorClass: "text-[#0A66C2] bg-[#0A66C2]/10 dark:bg-[#0A66C2]/20" },
    { key: "pinterest", name: "Pinterest", domain: "pinterest.com", svg: PinterestSvg, placeholder: "https://pinterest.com/chandjewelry", colorClass: "text-[#BD081C] bg-[#BD081C]/10 dark:bg-[#BD081C]/20" },
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

    const handleSave = async () => {
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
            <div className="p-8 flex items-center justify-center min-h-[60vh] text-zinc-400 text-xs font-sans">
                <span className="material-symbols-outlined animate-spin text-emerald-500 text-xl mr-2">progress_activity</span>
                Loading Social Links settings…
            </div>
        )
    }

    return (
        <div className="p-5 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-5 font-sans antialiased">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Social Media Channels
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Configure store social profiles. Enabled links dynamically sync across Footer, Contact Page & About Page.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-emerald-500 text-white dark:text-slate-950 px-4 py-2 rounded-[4px] font-semibold text-xs shadow-xs hover:bg-zinc-800 dark:hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-50 shrink-0"
                >
                    {saving ? (
                        <>
                            <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                            <span>Saving Changes…</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-sm">save</span>
                            <span>Save & Sync Website</span>
                        </>
                    )}
                </button>
            </div>

            {/* Active Summary Pill */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[4px] px-4 py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold text-emerald-950 dark:text-emerald-300">
                        {activeCount} of {PLATFORM_METADATA.length} Channels Active
                    </span>
                </div>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium hidden sm:inline">
                    Changes save instantly to live website
                </span>
            </div>

            {/* Single Unified Settings Table Card */}
            <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] shadow-xs overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {PLATFORM_METADATA.map((p) => {
                    const currentData = socialLinks[p.key] || { url: "", isActive: true }
                    const SvgIcon = p.svg
                    return (
                        <div
                            key={p.key}
                            className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                                currentData.isActive ? "hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30" : "opacity-50 bg-zinc-50/40 dark:bg-zinc-950/40"
                            }`}
                        >
                            {/* Left: Icon & Platform Info */}
                            <div className="flex items-center gap-3 sm:w-48 shrink-0">
                                <div className={`size-8 rounded-[4px] ${p.colorClass} flex items-center justify-center shrink-0`}>
                                    <SvgIcon className="w-4 h-4" />
                                </div>
                                <div className="truncate">
                                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{p.name}</h3>
                                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                                        {p.domain}
                                    </span>
                                </div>
                            </div>

                            {/* Middle: URL Input */}
                            <div className="flex-1 min-w-0">
                                <input
                                    type="text"
                                    value={currentData.url}
                                    onChange={(e) => handleUrlChange(p.key, e.target.value)}
                                    placeholder={p.placeholder}
                                    className="w-full bg-white dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 rounded-[4px] px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500 font-mono"
                                />
                            </div>

                            {/* Right: Visibility Badge & Toggle */}
                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] ${
                                    currentData.isActive
                                        ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                                }`}>
                                    {currentData.isActive ? "Visible" : "Hidden"}
                                </span>

                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={currentData.isActive}
                                        onChange={() => handleToggleActive(p.key)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-8 h-4.5 bg-zinc-200 peer-focus:outline-hidden rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all dark:after:border-zinc-600 peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
