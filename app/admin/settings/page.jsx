'use client'
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { setCurrency } from "@/lib/features/settings/settingsSlice"

const TABS = [
    { id: "general", label: "General", icon: "settings" },
    { id: "payment", label: "Payment", icon: "payments" },
    { id: "shipping", label: "Shipping", icon: "local_shipping" },
    { id: "profile", label: "Admin Profile", icon: "manage_accounts" },
    { id: "security", label: "Security", icon: "security" },
]

function InputField({ label, ...props }) {
    return (
        <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">{label}</label>
            <input {...props} className="w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all" />
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
            <button onClick={() => onChange(!value)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${value ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}>
                <span className={`inline-block size-3.5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ${value ? "translate-x-4" : "translate-x-1"}`} />
            </button>
        </div>
    )
}

export default function AdminSettings() {
    const dispatch = useDispatch()
    const globalCurrency = useSelector((state) => state.settings.currency)

    const [activeTab, setActiveTab] = useState("general")

    const [general, setGeneral] = useState({ storeName: "Janan Fashion", tagline: "Elegance & Perfection", supportEmail: "info@jananfashion.store", phone: "+92 300 1234567", timezone: "UTC+5", currency: "Rs" })
    const [payment, setPayment] = useState({ stripeKey: "sk_live_***", stripeEnabled: true, paypalEmail: "info@jananfashion.store", paypalEnabled: false, codEnabled: true })
    const [shipping, setShipping] = useState({ freeShippingMin: "2000", defaultRate: "200", expressRate: "450", internationalEnabled: false })
    const [profile, setProfile] = useState({ name: "Alex Rivera", email: "admin@jananfashion.store", role: "Super Admin" })
    const [security, setSecurity] = useState({ twoFactor: false, loginAlerts: true, sessionTimeout: "30", ipWhitelist: "" })

    useEffect(() => {
        setGeneral(g => ({ ...g, currency: globalCurrency }))
    }, [globalCurrency])

    const save = () => {
        dispatch(setCurrency(general.currency))
        toast.promise(new Promise(res => setTimeout(res, 600)), { loading: "Saving...", success: "Settings saved!", error: "Error" })
    }

    return (
        <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Settings</h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Manage store preferences, payment gateways, and security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                {/* Sidebar Tabs */}
                <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-2 shadow-xs h-fit space-y-1">
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs font-semibold transition-all text-left ${activeTab === tab.id ? "bg-zinc-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>
                            <span className="material-symbols-outlined text-base">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Panel */}
                <div className="lg:col-span-3 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] p-5 shadow-xs">
                    {activeTab === "general" && (
                        <div className="space-y-5">
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">General Settings</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <InputField label="Store Name" value={general.storeName} onChange={e => setGeneral(g => ({ ...g, storeName: e.target.value }))} />
                                <InputField label="Tagline" value={general.tagline} onChange={e => setGeneral(g => ({ ...g, tagline: e.target.value }))} />
                                <InputField label="Support Email" type="email" value={general.supportEmail} onChange={e => setGeneral(g => ({ ...g, supportEmail: e.target.value }))} />
                                <InputField label="Support Phone" value={general.phone} onChange={e => setGeneral(g => ({ ...g, phone: e.target.value }))} />
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Timezone</label>
                                    <select value={general.timezone} onChange={e => setGeneral(g => ({ ...g, timezone: e.target.value }))} className="w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all">
                                        {["UTC-8", "UTC-5", "UTC+0", "UTC+1", "UTC+5", "UTC+8"].map(tz => <option key={tz}>{tz}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Currency</label>
                                    <select value={general.currency} onChange={e => setGeneral(g => ({ ...g, currency: e.target.value }))} className="w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all">
                                        {["Rs", "PKR"].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "payment" && (
                        <div className="space-y-5">
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Payment Configuration</h2>
                            <div>
                                <ToggleRow label="Stripe Payments" description="Accept card payments via Stripe" value={payment.stripeEnabled} onChange={v => setPayment(p => ({ ...p, stripeEnabled: v }))} />
                                <ToggleRow label="PayPal" description="Accept PayPal payments" value={payment.paypalEnabled} onChange={v => setPayment(p => ({ ...p, paypalEnabled: v }))} />
                                <ToggleRow label="Cash on Delivery" description="Allow COD orders" value={payment.codEnabled} onChange={v => setPayment(p => ({ ...p, codEnabled: v }))} />
                            </div>
                            <div className="pt-2 space-y-3">
                                <InputField label="Stripe Secret Key" type="password" value={payment.stripeKey} onChange={e => setPayment(p => ({ ...p, stripeKey: e.target.value }))} placeholder="sk_live_..." />
                                <InputField label="PayPal Business Email" type="email" value={payment.paypalEmail} onChange={e => setPayment(p => ({ ...p, paypalEmail: e.target.value }))} />
                            </div>
                        </div>
                    )}

                    {activeTab === "shipping" && (
                        <div className="space-y-5">
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Shipping Settings</h2>
                            <ToggleRow label="International Shipping" description="Enable shipping to international addresses" value={shipping.internationalEnabled} onChange={v => setShipping(s => ({ ...s, internationalEnabled: v }))} />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                <InputField label="Free Shipping Min (Rs)" type="number" value={shipping.freeShippingMin} onChange={e => setShipping(s => ({ ...s, freeShippingMin: e.target.value }))} />
                                <InputField label="Standard Rate (Rs)" type="number" value={shipping.defaultRate} onChange={e => setShipping(s => ({ ...s, defaultRate: e.target.value }))} />
                                <InputField label="Express Rate (Rs)" type="number" value={shipping.expressRate} onChange={e => setShipping(s => ({ ...s, expressRate: e.target.value }))} />
                            </div>
                        </div>
                    )}

                    {activeTab === "profile" && (
                        <div className="space-y-5">
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Admin Profile</h2>
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-[4px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                                    AR
                                </div>
                                <div>
                                    <p className="font-bold text-xs text-zinc-900 dark:text-white">{profile.name}</p>
                                    <p className="text-[11px] text-zinc-400">{profile.email}</p>
                                    <span className="mt-0.5 inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold rounded-[4px]">{profile.role}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <InputField label="Full Name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                                <InputField label="Email" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">New Password</label>
                                <input type="password" placeholder="Leave blank to keep current" className="w-full bg-white dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-[4px] px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-emerald-500/20 transition-all" />
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-5">
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Security Settings</h2>
                            <div>
                                <ToggleRow label="Two-Factor Authentication" description="Require 2FA for admin logins" value={security.twoFactor} onChange={v => setSecurity(s => ({ ...s, twoFactor: v }))} />
                                <ToggleRow label="Login Alerts" description="Email alert on new device login" value={security.loginAlerts} onChange={v => setSecurity(s => ({ ...s, loginAlerts: v }))} />
                            </div>
                            <InputField label="Session Timeout (minutes)" type="number" value={security.sessionTimeout} onChange={e => setSecurity(s => ({ ...s, sessionTimeout: e.target.value }))} />
                            <InputField label="IP Whitelist (comma separated)" value={security.ipWhitelist} onChange={e => setSecurity(s => ({ ...s, ipWhitelist: e.target.value }))} placeholder="e.g. 192.168.1.1, 10.0.0.1" />
                        </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-2.5">
                        <button className="px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-[4px] text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">Discard</button>
                        <button onClick={save} className="px-4 py-2 bg-zinc-900 dark:bg-emerald-500 text-white dark:text-slate-950 rounded-[4px] text-xs font-semibold shadow-xs hover:bg-zinc-800 dark:hover:bg-emerald-400 transition-all">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
