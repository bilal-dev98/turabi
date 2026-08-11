'use client'
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { setCurrency } from "@/lib/features/settings/settingsSlice"

const TABS = [
    { id: "general", label: "General", icon: "settings" },
    { id: "payment", label: "Payment Options", icon: "payments" },
    { id: "shipping", label: "Shipping Rates", icon: "local_shipping" },
    { id: "profile", label: "Admin Profile", icon: "manage_accounts" },
    { id: "security", label: "Security & Access", icon: "security" },
]

function InputField({ label, ...props }) {
    return (
        <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">{label}</label>
            <input {...props} className="w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700/80 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all font-mono" />
        </div>
    )
}

function ToggleRow({ label, description, value, onChange }) {
    return (
        <div className="flex items-center justify-between py-3.5 border-b border-slate-100 dark:border-zinc-800/60 last:border-0">
            <div>
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{label}</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>
            </div>
            <button
                type="button"
                onClick={() => onChange(!value)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${value ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}
            >
                <span className={`inline-block size-3.5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ${value ? "translate-x-4" : "translate-x-1"}`} />
            </button>
        </div>
    )
}

export default function AdminSettings() {
    const dispatch = useDispatch()
    const globalCurrency = useSelector((state) => state.settings.currency)

    const [activeTab, setActiveTab] = useState("general")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const [uploadingLogo, setUploadingLogo] = useState(false)

    const [general, setGeneral] = useState({ storeName: "Chand Jewelry", tagline: "Handcrafted Luxury & Perfection", supportEmail: "info@chandjewelry.store", phone: "+92 300 1234567", timezone: "UTC+5", currency: "Rs", logo: "/logo.png" })
    const [payment, setPayment] = useState({ codEnabled: true, bankTransferEnabled: true, bankName: "Meezan Bank", accountTitle: "Chand Jewelry Store", accountNumber: "01020304050607", iban: "PK36MEZN0001020304050607" })
    const [shipping, setShipping] = useState({ freeShippingMin: "2000", defaultRate: "200", expressRate: "450", internationalEnabled: false })
    const [profile, setProfile] = useState({ name: "Alex Rivera", email: "admin@chandjewelry.store", role: "Super Admin", password: "", image: "" })
    const [security, setSecurity] = useState({ twoFactor: false, loginAlerts: true, sessionTimeout: "30", ipWhitelist: "" })

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/settings')
            const data = await res.json()
            if (data.success && data.data) {
                if (data.data.general) setGeneral(prev => ({ ...prev, ...data.data.general }))
                if (data.data.payment) setPayment(prev => ({ ...prev, ...data.data.payment }))
                if (data.data.shipping) setShipping(prev => ({ ...prev, ...data.data.shipping }))
                if (data.data.profile) setProfile(prev => ({ ...prev, ...data.data.profile }))
                if (data.data.security) setSecurity(prev => ({ ...prev, ...data.data.security }))
            }
        } catch (err) {
            toast.error("Failed to load settings")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploadingAvatar(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            const res = await fetch("/api/upload", { method: "POST", body: formData })
            const data = await res.json()
            if (data.success && data.url) {
                setProfile(p => ({ ...p, image: data.url }))
                toast.success("Profile picture uploaded! Click Save to apply.")
            } else {
                toast.error(data.message || "Failed to upload image")
            }
        } catch (err) {
            toast.error("Error uploading image")
        } finally {
            setUploadingAvatar(false)
        }
    }

    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploadingLogo(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            const res = await fetch("/api/upload", { method: "POST", body: formData })
            const data = await res.json()
            if (data.success && data.url) {
                setGeneral(g => ({ ...g, logo: data.url }))
                toast.success("Store logo uploaded! Click Save to apply.")
            } else {
                toast.error(data.message || "Failed to upload logo")
            }
        } catch (err) {
            toast.error("Error uploading logo")
        } finally {
            setUploadingLogo(false)
        }
    }

    const handleSave = async (e) => {
        if (e) e.preventDefault()
        setSaving(true)

        let payloadData = {}
        if (activeTab === 'general') payloadData = general
        else if (activeTab === 'payment') payloadData = payment
        else if (activeTab === 'shipping') payloadData = shipping
        else if (activeTab === 'profile') payloadData = profile
        else if (activeTab === 'security') payloadData = security

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: activeTab, data: payloadData })
            })
            const data = await res.json()
            if (data.success) {
                if (activeTab === 'general' && general.currency) {
                    dispatch(setCurrency(general.currency))
                }
                toast.success(`${TABS.find(t => t.id === activeTab)?.label} settings saved & synced!`)
                fetchSettings()
            } else {
                toast.error(data.message || "Failed to save settings")
            }
        } catch (err) {
            toast.error("Error connecting to server")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh] text-zinc-400 text-xs font-sans">
                <span className="material-symbols-outlined animate-spin text-emerald-500 text-xl mr-2">progress_activity</span>
                Loading Store Settings…
            </div>
        )
    }

    return (
        <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-5 font-sans antialiased">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Store Settings</h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Manage store preferences, payment methods, shipping rates, and security options.</p>
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
                            <span>Save {TABS.find(t => t.id === activeTab)?.label} Settings</span>
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                {/* Sidebar Tabs */}
                <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-2 shadow-xs h-fit space-y-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs font-semibold transition-all text-left ${
                                activeTab === tab.id
                                    ? "bg-zinc-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs"
                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }`}
                        >
                            <span className="material-symbols-outlined text-base">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Panel */}
                <div className="lg:col-span-3 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-5 shadow-xs">
                    {activeTab === "general" && (
                        <div className="space-y-5">
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-emerald-500">settings</span>
                                General Store Information
                            </h2>

                            {/* Store Logo Banner */}
                            <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-[4px] border border-zinc-200 dark:border-zinc-700/50">
                                <div className="flex items-center gap-3.5">
                                    <div className="h-12 w-24 rounded-[4px] bg-white dark:bg-zinc-900 p-2 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={general.logo || "/logo.png"} alt="Store Logo" className="h-full w-auto object-contain" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs text-zinc-900 dark:text-white">Store Logo</p>
                                        <p className="text-[11px] text-zinc-400">Used across navbar, footer, and emails</p>
                                    </div>
                                </div>

                                <label className="cursor-pointer inline-flex items-center gap-1.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-all">
                                    <span className="material-symbols-outlined text-base text-emerald-500">
                                        {uploadingLogo ? "progress_activity" : "upload_file"}
                                    </span>
                                    <span>{uploadingLogo ? "Uploading…" : "Upload Logo"}</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo} />
                                </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="Store Name" value={general.storeName} onChange={e => setGeneral(g => ({ ...g, storeName: e.target.value }))} />
                                <InputField label="Store Tagline" value={general.tagline} onChange={e => setGeneral(g => ({ ...g, tagline: e.target.value }))} />
                                <InputField label="Support Email" type="email" value={general.supportEmail} onChange={e => setGeneral(g => ({ ...g, supportEmail: e.target.value }))} />
                                <InputField label="Support Phone Number" value={general.phone} onChange={e => setGeneral(g => ({ ...g, phone: e.target.value }))} />
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Timezone</label>
                                    <select
                                        value={general.timezone}
                                        onChange={e => setGeneral(g => ({ ...g, timezone: e.target.value }))}
                                        className="w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700/80 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all font-mono"
                                    >
                                        {["UTC-8", "UTC-5", "UTC+0", "UTC+1", "UTC+5", "UTC+8"].map(tz => <option key={tz} value={tz}>{tz}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Store Currency</label>
                                    <select
                                        value={general.currency}
                                        onChange={e => setGeneral(g => ({ ...g, currency: e.target.value }))}
                                        className="w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700/80 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all font-mono"
                                    >
                                        {["Rs", "PKR", "$"].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "payment" && (
                        <div className="space-y-5">
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-emerald-500">payments</span>
                                Payment Methods Configuration
                            </h2>

                            <div className="space-y-1">
                                <ToggleRow
                                    label="Cash on Delivery (COD)"
                                    description="Allow customers to pay cash upon doorstep delivery"
                                    value={payment.codEnabled}
                                    onChange={v => setPayment(p => ({ ...p, codEnabled: v }))}
                                />
                                <ToggleRow
                                    label="Direct Bank Transfer"
                                    description="Accept direct bank account payments & IBAN transfers"
                                    value={payment.bankTransferEnabled}
                                    onChange={v => setPayment(p => ({ ...p, bankTransferEnabled: v }))}
                                />
                            </div>

                            {payment.bankTransferEnabled && (
                                <div className="pt-3 space-y-3 border-t border-slate-100 dark:border-zinc-800">
                                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                                        Bank Account Details
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <InputField
                                            label="Bank Name"
                                            value={payment.bankName}
                                            onChange={e => setPayment(p => ({ ...p, bankName: e.target.value }))}
                                            placeholder="e.g. Meezan Bank / HBL"
                                        />
                                        <InputField
                                            label="Account Title"
                                            value={payment.accountTitle}
                                            onChange={e => setPayment(p => ({ ...p, accountTitle: e.target.value }))}
                                            placeholder="e.g. Chand Jewelry Store"
                                        />
                                        <InputField
                                            label="Account Number"
                                            value={payment.accountNumber}
                                            onChange={e => setPayment(p => ({ ...p, accountNumber: e.target.value }))}
                                            placeholder="01020304050607"
                                        />
                                        <InputField
                                            label="IBAN"
                                            value={payment.iban}
                                            onChange={e => setPayment(p => ({ ...p, iban: e.target.value }))}
                                            placeholder="PK36MEZN0001020304050607"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "shipping" && (
                        <div className="space-y-5">
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-emerald-500">local_shipping</span>
                                Shipping & Delivery Rates
                            </h2>

                            <ToggleRow
                                label="International Shipping"
                                description="Enable shipping to international destinations outside Pakistan"
                                value={shipping.internationalEnabled}
                                onChange={v => setShipping(s => ({ ...s, internationalEnabled: v }))}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                                <InputField
                                    label="Free Shipping Min Threshold"
                                    type="number"
                                    value={shipping.freeShippingMin}
                                    onChange={e => setShipping(s => ({ ...s, freeShippingMin: e.target.value }))}
                                />
                                <InputField
                                    label="Standard Shipping Fee"
                                    type="number"
                                    value={shipping.defaultRate}
                                    onChange={e => setShipping(s => ({ ...s, defaultRate: e.target.value }))}
                                />
                                <InputField
                                    label="Express Shipping Fee"
                                    type="number"
                                    value={shipping.expressRate}
                                    onChange={e => setShipping(s => ({ ...s, expressRate: e.target.value }))}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "profile" && (
                        <div className="space-y-5">
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-emerald-500">manage_accounts</span>
                                Admin Account Profile
                            </h2>

                            <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-[4px] border border-zinc-200 dark:border-zinc-700/50">
                                <div className="flex items-center gap-3.5">
                                    <div className="relative size-12 rounded-[4px] overflow-hidden bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-sm shrink-0 border border-zinc-200 dark:border-zinc-700">
                                        {profile.image ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={profile.image} alt={profile.name} className="size-full object-cover" />
                                        ) : (
                                            <span>{(profile.name || "Admin").split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs text-zinc-900 dark:text-white">{profile.name}</p>
                                        <p className="text-[11px] text-zinc-400 font-mono">{profile.email}</p>
                                        <span className="mt-1 inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold rounded-[4px] uppercase tracking-wider">
                                            {profile.role}
                                        </span>
                                    </div>
                                </div>

                                <label className="cursor-pointer inline-flex items-center gap-1.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-all">
                                    <span className="material-symbols-outlined text-base text-emerald-500">
                                        {uploadingAvatar ? "progress_activity" : "photo_camera"}
                                    </span>
                                    <span>{uploadingAvatar ? "Uploading…" : "Change Photo"}</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                                </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <InputField label="Full Administrator Name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                                <InputField label="Administrator Email" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Change Admin Password</label>
                                <input
                                    type="password"
                                    value={profile.password || ""}
                                    onChange={e => setProfile(p => ({ ...p, password: e.target.value }))}
                                    placeholder="Enter new password to change..."
                                    className="w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700/80 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all font-mono"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-5">
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-emerald-500">security</span>
                                Security & Access Policies
                            </h2>

                            <div className="space-y-1">
                                <ToggleRow
                                    label="Two-Factor Authentication (2FA)"
                                    description="Require authenticator code for admin panel access"
                                    value={security.twoFactor}
                                    onChange={v => setSecurity(s => ({ ...s, twoFactor: v }))}
                                />
                                <ToggleRow
                                    label="Login Security Alerts"
                                    description="Send email notification whenever admin logs in from new IP"
                                    value={security.loginAlerts}
                                    onChange={v => setSecurity(s => ({ ...s, loginAlerts: v }))}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <InputField
                                    label="Session Timeout (minutes)"
                                    type="number"
                                    value={security.sessionTimeout}
                                    onChange={e => setSecurity(s => ({ ...s, sessionTimeout: e.target.value }))}
                                />
                                <InputField
                                    label="IP Whitelist (comma separated)"
                                    value={security.ipWhitelist}
                                    onChange={e => setSecurity(s => ({ ...s, ipWhitelist: e.target.value }))}
                                    placeholder="e.g. 192.168.1.1, 10.0.0.1"
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={fetchSettings}
                            className="px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-[4px] text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                        >
                            Reset / Reload
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="px-5 py-2 bg-zinc-900 dark:bg-emerald-500 text-white dark:text-slate-950 rounded-[4px] text-xs font-semibold shadow-xs hover:bg-zinc-800 dark:hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center gap-1.5"
                        >
                            {saving ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
