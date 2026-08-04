'use client'
import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import { format } from "date-fns"
import toast from "react-hot-toast"
import Pagination from "@/components/admin/Pagination"
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal"
import { exportToCSV } from "@/lib/csvExport"
import UserFormModal from "@/components/admin/UserFormModal"
import UserViewModal from "@/components/admin/UserViewModal"

const PER_PAGE = 10

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filterRole, setFRole] = useState("ALL")
    const [page, setPage] = useState(1)

    // Modal States
    const [banTarget, setBanTarget] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editUser, setEditUser] = useState(null)

    // View Modal States
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [viewUserDetails, setViewUserDetails] = useState(null)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/users")
            const json = await res.json()
            if (json.success) setUsers(json.data)
        } catch (error) {
            toast.error("Failed to load users")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const filtered = useMemo(() => users.filter(u => {
        const matchRole = filterRole === "ALL" || u.role === filterRole
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
        return matchRole && matchSearch
    }), [users, search, filterRole])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    const handleSearch = (v) => { setSearch(v); setPage(1) }
    const handleFilter = (v) => { setFRole(v); setPage(1) }

    const handleAddUser = () => {
        setEditUser(null)
        setIsFormOpen(true)
    }

    const handleEditUser = (u) => {
        setEditUser(u)
        setIsFormOpen(true)
    }

    const handleViewUser = async (u) => {
        setIsViewOpen(true)
        setViewUserDetails(null)
        try {
            const res = await fetch(`/api/admin/users/${u.id}`)
            const data = await res.json()
            if (data.success) {
                setViewUserDetails(data.data)
            } else {
                toast.error("Failed to load user details")
                setIsViewOpen(false)
            }
        } catch (error) {
            toast.error("Connection error")
            setIsViewOpen(false)
        }
    }

    // Ban Logic
    const confirmBan = (u) => setBanTarget(u)
    const executeBan = async () => {
        const newState = !banTarget.isBanned

        try {
            const res = await fetch(`/api/admin/users/${banTarget.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isBanned: newState })
            })
            const data = await res.json()

            if (data.success) {
                toast.success(`${banTarget.name} ${newState ? "banned" : "unbanned"}`)
                fetchUsers()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Action failed")
        } finally {
            setBanTarget(null)
        }
    }

    // Delete Logic
    const confirmDelete = (u) => setDeleteTarget(u)
    const executeDelete = async () => {
        try {
            const res = await fetch(`/api/admin/users/${deleteTarget.id}`, { method: "DELETE" })
            const data = await res.json()

            if (data.success) {
                toast.success("User deleted permanently")
                fetchUsers()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Action failed")
        } finally {
            setDeleteTarget(null)
        }
    }

    const handleExport = () => {
        const rows = filtered.map(u => ({
            ID: u.id, Name: u.name, Email: u.email, Role: u.role,
            Orders: u.orders, Spent: u.spent,
            Status: u.isBanned ? "Banned" : "Active",
            Joined: format(new Date(u.joinedAt), "yyyy-MM-dd")
        }))
        exportToCSV(rows, "users")
        toast.success("Exported as users.csv")
    }

    if (loading) return <div className="p-8 flex items-center gap-3 text-zinc-400 dark:text-zinc-500 text-sm"><span className="material-symbols-outlined animate-spin text-emerald-500">progress_activity</span>Loading users…</div>

    return (
        <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Users</h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{users.length} registered users</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={handleAddUser} className="flex items-center gap-2 bg-zinc-900 dark:bg-emerald-500 text-white dark:text-slate-950 px-3.5 py-2 rounded-[4px] font-semibold text-xs shadow-xs hover:bg-zinc-800 dark:hover:bg-emerald-400 transition-all">
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add User
                    </button>
                    <button onClick={handleExport} className="flex items-center gap-2 border border-slate-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 px-3.5 py-2 rounded-[4px] text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-bold">
                    <span className="material-symbols-outlined text-xs">person</span>
                    {users.filter(u => u.role === "customer").length} Customers
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 text-xs font-bold">
                    <span className="material-symbols-outlined text-xs">store</span>
                    {users.filter(u => u.role === "seller").length} Sellers
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40 text-xs font-bold">
                    <span className="material-symbols-outlined text-xs">block</span>
                    {users.filter(u => u.isBanned).length} Banned
                </div>
            </div>

            {/* Search + filter */}
            <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] px-4 py-2.5 flex items-center gap-3 flex-wrap shadow-xs">
                <span className="material-symbols-outlined text-zinc-400 text-sm">search</span>
                <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search by name or email…"
                    className="flex-1 min-w-[160px] bg-transparent text-xs text-zinc-700 dark:text-zinc-200 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500" />
                <div className="flex items-center gap-1 border-l border-zinc-200 dark:border-zinc-800 pl-3">
                    {["ALL", "customer", "seller"].map(r => (
                        <button key={r} onClick={() => handleFilter(r)}
                            className={`px-2.5 py-1 rounded-[4px] text-xs font-semibold capitalize transition-all ${filterRole === r ? "bg-zinc-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>
                            {r === "ALL" ? "All" : r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-[4px] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                            <tr>
                                {["User", "Role", "Orders", "Total Spent", "Joined", "Status", "Actions"].map(h => (
                                    <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {paginated.length === 0 && (
                                <tr><td colSpan={7} className="px-6 py-16 text-center text-zinc-400 dark:text-zinc-600 text-sm">No users found.</td></tr>
                            )}
                            {paginated.map(user => (
                                <tr key={user.id} className={`hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors ${user.isBanned ? "opacity-60" : ""}`}>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            {user.image ? (
                                                <Image src={user.image} alt={user.name} width={32} height={32} className="size-8 rounded-full object-cover shrink-0" />
                                            ) : (
                                                <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300 shrink-0">
                                                    {(user.name || "U").charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-xs font-semibold text-zinc-900 dark:text-white">{user.name}</p>
                                                <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase ${user.role === "seller" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-xs font-semibold text-zinc-700 dark:text-zinc-300">{user.orders}</td>
                                    <td className="px-5 py-3 text-xs font-bold text-zinc-900 dark:text-white">${user.spent}</td>
                                    <td className="px-5 py-3 text-xs text-zinc-500 dark:text-zinc-400">{format(new Date(user.joinedAt), "MMM d, yyyy")}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${user.isBanned ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"}`}>
                                            <span className="material-symbols-outlined text-xs">{user.isBanned ? "block" : "check_circle"}</span>
                                            {user.isBanned ? "Banned" : "Active"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => handleViewUser(user)} className="p-1.5 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-[4px] transition-all" title="View Details">
                                                <span className="material-symbols-outlined text-sm">visibility</span>
                                            </button>
                                            <button onClick={() => handleEditUser(user)} className="p-1.5 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-[4px] transition-all" title="Edit User">
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                            <button onClick={() => confirmBan(user)} className={`p-1.5 rounded-[4px] transition-all ${user.isBanned ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30' : 'text-zinc-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30'}`} title={user.isBanned ? "Unban User" : "Ban User"}>
                                                <span className="material-symbols-outlined text-sm">{user.isBanned ? 'check_circle' : 'block'}</span>
                                            </button>
                                            <button onClick={() => confirmDelete(user)} className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-[4px] transition-all" title="Delete User">
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-5 py-3.5 border-t border-zinc-200 dark:border-zinc-800">
                    <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                </div>
            </div>

            <DeleteConfirmModal
                open={!!banTarget}
                title={banTarget?.isBanned ? `Unban ${banTarget?.name}?` : `Ban ${banTarget?.name}?`}
                description={banTarget?.isBanned ? "This user will regain regular access to the platform." : "This user will lose ability to purchase or login."}
                confirmLabel={banTarget?.isBanned ? "Unban User" : "Ban User"}
                danger={!banTarget?.isBanned}
                onConfirm={executeBan}
                onCancel={() => setBanTarget(null)}
            />

            <DeleteConfirmModal
                open={!!deleteTarget}
                title={`Delete ${deleteTarget?.name}?`}
                description="This action is permanent. All orders and data associated with this user will be removed from the database."
                confirmLabel="Delete User"
                danger={true}
                onConfirm={executeDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            <UserFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                user={editUser}
                onSuccess={fetchUsers}
            />

            <UserViewModal
                isOpen={isViewOpen}
                onClose={() => { setIsViewOpen(false); setViewUserDetails(null); }}
                userDetails={viewUserDetails}
            />
        </div>
    )
}
