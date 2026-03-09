'use client'
import { usePathname } from "next/navigation"
import Link from "next/link"

const AdminSidebar = ({ open, onClose }) => {
    const pathname = usePathname()

    const sidebarLinks = [
        { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
        { name: 'Products', href: '/admin/products', icon: 'inventory_2' },
        { name: 'Categories', href: '/admin/categories', icon: 'category' },
        { name: 'Orders', href: '/admin/orders', icon: 'receipt_long' },
        { name: 'Users', href: '/admin/users', icon: 'group' },
        { name: 'Approve', href: '/admin/approve', icon: 'verified' },
        { name: 'Coupons', href: '/admin/coupons', icon: 'confirmation_number' },
        { name: 'Home Sections', href: '/admin/homepage-sections', icon: 'view_quilt' },
        { name: 'Analytics', href: '/admin/analytics', icon: 'analytics' },
        { name: 'Activity', href: '/admin/activity', icon: 'history' },
        { name: 'Newsletter', href: '/admin/newsletter', icon: 'mail' },
        { name: 'Messages', href: '/admin/messages', icon: 'forum' },
        { name: 'Banners', href: '/admin/banners', icon: 'campaign' },
        { name: 'Settings', href: '/admin/settings', icon: 'settings' },
    ]

    const SidebarContent = () => (
        <aside className="w-64 bg-white dark:bg-[#0a0a0a] border-r border-primary/5 dark:border-white/5 h-full flex flex-col transition-colors duration-200">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="size-9 bg-primary rounded-lg flex items-center justify-center text-slate-900 shrink-0">
                    <span className="material-symbols-outlined text-sm font-bold">shopping_cart</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">gocart.plus</span>
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-400 font-semibold">Ultra-Premium</span>
                </div>
                {/* Mobile close button */}
                {onClose && (
                    <button onClick={onClose} className="ml-auto p-1 text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400 lg:hidden">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                )}
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto no-scrollbar pb-4">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 pt-2 pb-3">Menu</div>
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-sm group ${isActive
                                ? 'bg-primary/20 text-primary'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-[20px] transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : ''}`}>
                                {link.icon}
                            </span>
                            <span>{link.name}</span>
                            {isActive && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
                        </Link>
                    )
                })}
            </nav>

            {/* Plan widget */}
            <div className="p-4">
                <div className="bg-primary/5 dark:bg-primary/[0.06] rounded-2xl p-4 border border-primary/10 dark:border-primary/10">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Plan</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Enterprise Elite</p>
                    <div className="mt-2.5 w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-3/4 rounded-full" />
                    </div>
                </div>
            </div>
        </aside>
    )

    return (
        <>
            {/* Desktop sidebar — always visible */}
            <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64">
                <SidebarContent />
            </div>

            {/* Mobile sidebar — slide-in drawer */}
            {open && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                        onClick={onClose}
                    />
                    {/* Drawer */}
                    <div className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden shadow-2xl animate-slide-in-left">
                        <SidebarContent />
                    </div>
                </>
            )}
        </>
    )
}

export default AdminSidebar