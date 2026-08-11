'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"

const AdminLayout = ({ children }) => {
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)

    useEffect(() => {
        let isMounted = true
        const verifyAdmin = async () => {
            try {
                const token = typeof window !== 'undefined' ? (localStorage.getItem("cj_admin_token") || "") : ""
                const res = await fetch("/api/admin/auth/verify", {
                    headers: { "Authorization": `Bearer ${token}` }
                })
                const data = await res.json()
                if (isMounted) {
                    if (data.authenticated) {
                        setIsAdmin(true)
                    } else {
                        setIsAdmin(false)
                        router.push("/admin-login.php")
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setIsAdmin(false)
                    router.push("/admin-login.php")
                }
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        verifyAdmin()
        const saved = typeof window !== 'undefined' ? localStorage.getItem("admin_sidebar_collapsed") : null
        if (saved === "true") {
            setCollapsed(true)
        }

        return () => { isMounted = false }
    }, [router])

    const toggleCollapse = () => {
        setCollapsed(prev => {
            const next = !prev
            if (typeof window !== 'undefined') {
                localStorage.setItem("admin_sidebar_collapsed", next ? "true" : "false")
            }
            return next
        })
    }

    if (loading) {
        return <Loading />
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
                <div className="size-16 rounded-[4px] bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-500 mb-4 shadow-xs">
                    <span className="material-symbols-outlined text-3xl">lock</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Access Restricted</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">You must authenticate via Admin Login to access the Admin Panel.</p>
                <div className="flex items-center gap-3 mt-6">
                    <Link href="/admin-login.php" className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center gap-2 px-5 py-2.5 rounded-[4px] text-sm transition-all shadow-xs">
                        Admin Login <ArrowRightIcon size={16} />
                    </Link>
                    <Link href="/" className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium flex items-center gap-2 px-5 py-2.5 rounded-[4px] text-sm transition-all shadow-xs">
                        Homepage
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#f6f6f7] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 min-h-screen flex font-sans antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-emerald-500 dark:selection:text-zinc-950 transition-colors duration-200">
            <AdminSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                collapsed={collapsed}
                onToggleCollapse={toggleCollapse}
            />
            <main className={`flex-1 ${collapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300 min-h-screen flex flex-col w-full relative min-w-0 overflow-x-hidden`}>
                <AdminNavbar
                    onMenuClick={() => setSidebarOpen(true)}
                    collapsed={collapsed}
                    onToggleCollapse={toggleCollapse}
                />
                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default AdminLayout