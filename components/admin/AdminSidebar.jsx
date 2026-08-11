'use client'
import { usePathname } from "next/navigation"
import Link from "next/link"

const AdminSidebar = ({ open, onClose, collapsed = false, onToggleCollapse }) => {
    const pathname = usePathname()

    const navGroups = [
        {
            title: "Core",
            links: [
                { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
                { name: 'Analytics', href: '/admin/activity', icon: 'analytics' },
                { name: 'Activity Log', href: '/admin/activity', icon: 'history' },
            ]
        },
        {
            title: "Store Operations",
            links: [
                { name: 'Products', href: '/admin/products', icon: 'inventory_2' },
                { name: 'Categories', href: '/admin/categories', icon: 'category' },
                { name: 'Orders', href: '/admin/orders', icon: 'receipt_long' },
                { name: 'Store Approval', href: '/admin/approve', icon: 'verified' },
                { name: 'Coupons', href: '/admin/coupons', icon: 'confirmation_number' },
                { name: 'Home Sections', href: '/admin/homepage-sections', icon: 'view_quilt' },
                { name: 'Shop Highlights', href: '/admin/shop-highlights', icon: 'style' },
                { name: 'Banners', href: '/admin/banners', icon: 'campaign' },
            ]
        },
        {
            title: "Customers & Comms",
            links: [
                { name: 'Users', href: '/admin/users', icon: 'group' },
                { name: 'Messages', href: '/admin/messages', icon: 'forum' },
                { name: 'Newsletter', href: '/admin/newsletter', icon: 'mail' },
            ]
        },
        {
            title: "Settings",
            links: [
                { name: 'Social Links', href: '/admin/social', icon: 'share' },
                { name: 'Settings', href: '/admin/settings', icon: 'settings' },
            ]
        }
    ]

    const SidebarContent = ({ isCompact = false }) => (
        <aside className={`${isCompact ? 'w-16' : 'w-64'} bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800/80 h-full flex flex-col transition-all duration-300 select-none`}>
            {/* Header Brand */}
            <div className={`h-16 px-4 flex items-center ${isCompact ? 'justify-center' : 'justify-between'} border-b border-zinc-200 dark:border-zinc-800/80`}>
                <Link href="/admin" className="flex items-center gap-2 shrink-0 group" title="Chand Jewelry Admin">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="Chand Jewelry Logo" className="h-8 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform" />
                </Link>

                {!isCompact && (
                    <div className="flex items-center gap-1">
                        {/* Desktop Collapse Toggle Button */}
                        <button
                            type="button"
                            onClick={onToggleCollapse}
                            className="hidden lg:flex p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-[4px] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Collapse sidebar"
                        >
                            <span className="material-symbols-outlined text-xl">side_navigation</span>
                        </button>

                        {/* Mobile Close Button */}
                        {onClose && (
                            <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-[4px] lg:hidden hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Nav Groups */}
            <nav className="flex-1 px-2.5 py-4 space-y-4 overflow-y-auto custom-scrollbar">
                {navGroups.map((group) => (
                    <div key={group.title} className="space-y-1">
                        {!isCompact && (
                            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-3 pb-1 select-none">
                                {group.title}
                            </div>
                        )}
                        {group.links.map((link) => {
                            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={onClose}
                                    title={link.name}
                                    className={`flex items-center ${isCompact ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2'} rounded-[4px] font-medium transition-all text-xs lg:text-sm group relative ${isActive
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs'
                                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                                        }`}
                                >
                                    {isActive && (
                                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-500 rounded-r-full" />
                                    )}
                                    <span className={`material-symbols-outlined text-[19px] transition-colors ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-200'}`}>
                                        {link.icon}
                                    </span>
                                    {!isCompact && <span className="truncate">{link.name}</span>}
                                </Link>
                            )
                        })}
                    </div>
                ))}
            </nav>

            {/* Sidebar Footer Widget */}
            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800/80">
                <div className={`bg-zinc-50 dark:bg-zinc-800/50 rounded-[4px] ${isCompact ? 'p-2 flex justify-center' : 'p-3 flex items-center gap-3'} border border-zinc-200 dark:border-zinc-700/50`}>
                    <div className="size-8 rounded-[4px] bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs shrink-0">
                        PRO
                    </div>
                    {!isCompact && (
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">Enterprise Store</p>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">v2.4 • Chand Jewelry</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    )

    return (
        <>
            {/* Desktop sidebar */}
            <div className={`hidden lg:block fixed inset-y-0 left-0 z-40 ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
                <SidebarContent isCompact={collapsed} />
            </div>

            {/* Mobile drawer */}
            {open && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
                        onClick={onClose}
                    />
                    <div className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden shadow-2xl animate-in slide-in-from-left duration-200">
                        <SidebarContent isCompact={false} />
                    </div>
                </>
            )}
        </>
    )
}

export default AdminSidebar