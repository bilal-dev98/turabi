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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">{label}</label>
            <input {...props} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
        </div>
    )
}

function ToggleRow({ label, description, value, onChange }) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
            <div>
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            </div>
            <button onClick={() => onChange(!value)}
                className={`relative inline-flex size-6 w-11 items-center rounded-full transition-colors duration-200 ${value ? "bg-primary" : "bg-slate-200"}`}>
                <span className={`inline-block size-4 transform rounded-full bg-white shadow transition-transform duration-200 ${value ? "translate-x-6" : "translate-x-1"}`} />
            </button>
        </div>
    )
}

export default function AdminSettings() {
    const dispatch = useDispatch()
    const globalCurrency = useSelector((state) => state.settings.currency)

    const [activeTab, setActiveTab] = useState("general")

    const [general, setGeneral] = useState({ storeName: "GoCart.plus", tagline: "Shop smarter", supportEmail: "support@gocart.plus", phone: "+1 (555) 000-0000", timezone: "UTC+5", currency: "USD" })
    const [payment, setPayment] = useState({ stripeKey: "sk_live_***", stripeEnabled: true, paypalEmail: "sales@gocart.plus", paypalEnabled: false, codEnabled: true })
    const [shipping, setShipping] = useState({ freeShippingMin: "50", defaultRate: "5.99", expressRate: "14.99", internationalEnabled: false })
    const [profile, setProfile] = useState({ name: "Alex Rivera", email: "admin@gocart.plus", role: "Super Admin" })
    const [security, setSecurity] = useState({ twoFactor: false, loginAlerts: true, sessionTimeout: "30", ipWhitelist: "" })

    useEffect(() => {
        setGeneral(g => ({ ...g, currency: globalCurrency }))
    }, [globalCurrency])

    const save = () => {
        dispatch(setCurrency(general.currency))
        toast.promise(new Promise(res => setTimeout(res, 600)), { loading: "Saving...", success: "Settings saved!", error: "Error" })
    }

    return (
        <div className="p-10 max-w-7xl mx-auto w-full space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings <span className="text-slate-400 font-medium">& Configuration</span></h1>
                <p className="text-sm text-slate-500 mt-1">Manage your platform configuration</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="bg-white rounded-2xl p-3 shadow-sm shadow-primary/5 border border-primary/5 h-fit">
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${activeTab === tab.id ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-50"}`}>
                            <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Panel */}
                <div className="lg:col-span-3 bg-white rounded-2xl p-8 shadow-sm shadow-primary/5 border border-primary/5">
                    {activeTab === "general" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-900">General Settings</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="Store Name" value={general.storeName} onChange={e => setGeneral(g => ({ ...g, storeName: e.target.value }))} />
                                <InputField label="Tagline" value={general.tagline} onChange={e => setGeneral(g => ({ ...g, tagline: e.target.value }))} />
                                <InputField label="Support Email" type="email" value={general.supportEmail} onChange={e => setGeneral(g => ({ ...g, supportEmail: e.target.value }))} />
                                <InputField label="Support Phone" value={general.phone} onChange={e => setGeneral(g => ({ ...g, phone: e.target.value }))} />
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Timezone</label>
                                    <select value={general.timezone} onChange={e => setGeneral(g => ({ ...g, timezone: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary/20">
                                        {["UTC-8", "UTC-5", "UTC+0", "UTC+1", "UTC+5", "UTC+8"].map(tz => <option key={tz}>{tz}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Currency</label>
                                    <select value={general.currency} onChange={e => setGeneral(g => ({ ...g, currency: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary/20">
                                        {["USD", "EUR", "GBP", "PKR - Rs", "AED"].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "payment" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-900">Payment Configuration</h2>
                            <div className="space-y-0">
                                <ToggleRow label="Stripe Payments" description="Accept card payments via Stripe" value={payment.stripeEnabled} onChange={v => setPayment(p => ({ ...p, stripeEnabled: v }))} />
                                <ToggleRow label="PayPal" description="Accept PayPal payments" value={payment.paypalEnabled} onChange={v => setPayment(p => ({ ...p, paypalEnabled: v }))} />
                                <ToggleRow label="Cash on Delivery" description="Allow COD orders" value={payment.codEnabled} onChange={v => setPayment(p => ({ ...p, codEnabled: v }))} />
                            </div>
                            <div className="pt-4 space-y-4">
                                <InputField label="Stripe Secret Key" type="password" value={payment.stripeKey} onChange={e => setPayment(p => ({ ...p, stripeKey: e.target.value }))} placeholder="sk_live_..." />
                                <InputField label="PayPal Business Email" type="email" value={payment.paypalEmail} onChange={e => setPayment(p => ({ ...p, paypalEmail: e.target.value }))} />
                            </div>
                        </div>
                    )}

                    {activeTab === "shipping" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-900">Shipping Settings</h2>
                            <ToggleRow label="International Shipping" description="Enable shipping to international addresses" value={shipping.internationalEnabled} onChange={v => setShipping(s => ({ ...s, internationalEnabled: v }))} />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                <InputField label="Free Shipping Minimum ($)" type="number" value={shipping.freeShippingMin} onChange={e => setShipping(s => ({ ...s, freeShippingMin: e.target.value }))} />
                                <InputField label="Standard Rate ($)" type="number" value={shipping.defaultRate} onChange={e => setShipping(s => ({ ...s, defaultRate: e.target.value }))} />
                                <InputField label="Express Rate ($)" type="number" value={shipping.expressRate} onChange={e => setShipping(s => ({ ...s, expressRate: e.target.value }))} />
                            </div>
                        </div>
                    )}

                    {activeTab === "profile" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-900">Admin Profile</h2>
                            <div className="flex items-center gap-5">
                                <div className="size-16 rounded-2xl bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center shrink-0">
                                    <span className="text-2xl font-bold text-primary">AR</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{profile.name}</p>
                                    <p className="text-sm text-slate-500">{profile.email}</p>
                                    <span className="mt-1 inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-[11px] font-bold rounded-full">{profile.role}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="Full Name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                                <InputField label="Email" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">New Password</label>
                                <input type="password" placeholder="Leave blank to keep current" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-900">Security Settings</h2>
                            <div>
                                <ToggleRow label="Two-Factor Authentication" description="Require 2FA for admin logins" value={security.twoFactor} onChange={v => setSecurity(s => ({ ...s, twoFactor: v }))} />
                                <ToggleRow label="Login Alerts" description="Email alert on new device login" value={security.loginAlerts} onChange={v => setSecurity(s => ({ ...s, loginAlerts: v }))} />
                            </div>
                            <InputField label="Session Timeout (minutes)" type="number" value={security.sessionTimeout} onChange={e => setSecurity(s => ({ ...s, sessionTimeout: e.target.value }))} />
                            <InputField label="IP Whitelist (comma separated)" value={security.ipWhitelist} onChange={e => setSecurity(s => ({ ...s, ipWhitelist: e.target.value }))} placeholder="e.g. 192.168.1.1, 10.0.0.1" />
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                        <button className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">Discard</button>
                        <button onClick={save} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
