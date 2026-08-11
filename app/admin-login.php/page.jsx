'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import Link from "next/link"

export default function AdminLogin() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [securityAnswer, setSecurityAnswer] = useState("")
    const [captchaAnswer, setCaptchaAnswer] = useState("")

    // Math Captcha state
    const [num1, setNum1] = useState(0)
    const [num2, setNum2] = useState(0)
    const [loading, setLoading] = useState(false)
    const [checkingAuth, setCheckingAuth] = useState(true)

    const generateCaptcha = () => {
        const n1 = Math.floor(Math.random() * 9) + 1
        const n2 = Math.floor(Math.random() * 9) + 1
        setNum1(n1)
        setNum2(n2)
        setCaptchaAnswer("")
    }

    useEffect(() => {
        generateCaptcha()
        // Check if already logged in
        const checkExistingAuth = async () => {
            try {
                const res = await fetch('/api/admin/auth/verify', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('cj_admin_token') || ''}` }
                })
                const data = await res.json()
                if (data.authenticated) {
                    router.push('/admin')
                    return
                }
            } catch (err) {}
            setCheckingAuth(false)
        }
        checkExistingAuth()
    }, [router])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error("Please enter email and password")
            return
        }

        if (!securityAnswer) {
            toast.error("Please enter your Secret Security Code")
            return
        }

        if (!captchaAnswer) {
            toast.error("Please solve the Math Captcha challenge")
            return
        }

        if (parseInt(captchaAnswer) !== (num1 + num2)) {
            toast.error("Incorrect Captcha answer. Please try again.")
            generateCaptcha()
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/admin/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    securityAnswer,
                    captchaAnswer,
                    num1,
                    num2
                })
            })

            const data = await res.json()

            if (data.success && data.token) {
                localStorage.setItem('cj_admin_token', data.token)
                toast.success("Admin Authentication Successful!")
                window.location.href = '/admin'
            } else {
                toast.error(data.message || "Authentication failed")
                generateCaptcha()
            }
        } catch (err) {
            toast.error("Error connecting to server")
            generateCaptcha()
        } finally {
            setLoading(false)
        }
    }

    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center font-sans">
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="material-symbols-outlined animate-spin text-emerald-500 text-2xl">progress_activity</span>
                    Verifying Admin Privileges…
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-center items-center px-4 py-12 font-sans antialiased selection:bg-emerald-500 selection:text-zinc-950">
            {/* Background ambient glow */}
            <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md space-y-8 relative z-10">
                {/* Brand Header */}
                <div className="text-center space-y-3">
                    <Link href="/" className="inline-block group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.png" alt="Chand Jewelry Logo" className="h-10 w-auto mx-auto object-contain group-hover:scale-105 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Admin Authentication</h1>
                        <p className="text-xs text-zinc-400 mt-1">Authorized Administrator Access Only</p>
                    </div>
                </div>

                {/* Login Form Container */}
                <div className="bg-[#121215] border border-zinc-800 rounded-xl p-6 sm:p-8 shadow-2xl space-y-5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Admin Email */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Admin Email</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">mail</span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="admin@admin.com"
                                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                                />
                            </div>
                        </div>

                        {/* Admin Password */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Password</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">lock</span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                                />
                            </div>
                        </div>

                        {/* Security Question */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                                Security Question: <span className="text-zinc-300 font-normal">What is your Secret Security Code?</span>
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">verified_user</span>
                                <input
                                    type="text"
                                    required
                                    value={securityAnswer}
                                    onChange={e => setSecurityAnswer(e.target.value)}
                                    placeholder="Enter security code..."
                                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono uppercase"
                                />
                            </div>
                        </div>

                        {/* Math Captcha Challenge */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                    Security Captcha Verification
                                </label>
                                <button
                                    type="button"
                                    onClick={generateCaptcha}
                                    className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-xs">refresh</span> New Math Problem
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-extrabold text-emerald-400 font-mono shrink-0 select-none tracking-widest">
                                    {num1} + {num2} = ?
                                </div>
                                <input
                                    type="number"
                                    required
                                    value={captchaAnswer}
                                    onChange={e => setCaptchaAnswer(e.target.value)}
                                    placeholder="Result..."
                                    className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-center"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3 px-4 rounded-lg text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                    <span>Authenticating…</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                                    <span>Authenticate Admin Access</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Return Link */}
                <div className="text-center">
                    <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Return to Storefront
                    </Link>
                </div>
            </div>
        </div>
    )
}
