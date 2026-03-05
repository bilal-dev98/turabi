'use client'
import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import { dummyUserData } from "@/assets/assets"
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
        setViewUserDetails(null) // Reset while loading
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
            });
            const data = await res.json();

            if (data.success) {
                toast.success(`${banTarget.name} ${newState ? "banned" : "unbanned"}`)
                fetchUsers() // Refresh list
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
                fetchUsers() // Refresh list
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

    if (loading) return <div className="p-10 text-slate-400">Loading...</div>

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">Users <span className="text-slate-400 font-medium">Management</span></h1>
                    <p className="text-sm text-slate-500 mt-1">{users.length} registered users</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleAddUser} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add User
                    </button>
                    <button onClick={handleExport} className="flex items-center gap-2 border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">person</span>
                    {users.filter(u => u.role === "customer").length} Customers
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-100 text-blue-600 text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">store</span>
                    {users.filter(u => u.role === "seller").length} Sellers
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-100 text-red-500 text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">block</span>
                    {users.filter(u => u.isBanned).length} Banned
                </div>
            </div>

            {/* Search + filter */}
            <div className="bg-white rounded-2xl px-5 py-3.5 shadow-sm shadow-primary/5 border border-primary/5 flex items-center gap-4 flex-wrap">
                <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
                <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search by name or email…"
                    className="flex-1 min-w-[160px] bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
                <div className="flex items-center gap-1 border-l border-slate-100 pl-4">
                    {["ALL", "customer", "seller"].map(r => (
                        <button key={r} onClick={() => handleFilter(r)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${filterRole === r ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100"}`}>
                            {r === "ALL" ? "All" : r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm shadow-primary/5 border border-primary/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] uppercase tracking-widest font-bold text-slate-400">
                                <th className="px-5 py-4">User</th>
                                <th className="px-5 py-4">Role</th>
                                <th className="px-5 py-4">Orders</th>
                                <th className="px-5 py-4">Total Spent</th>
                                <th className="px-5 py-4">Joined</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginated.length === 0 && (
                                <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400 text-sm">No users found.</td></tr>
                            )}
                            {paginated.map(user => (
                                <tr key={user.id} className={`hover:bg-slate-50/50 transition-colors ${user.isBanned ? "opacity-60" : ""}`}>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            {user.image ? (
                                                <Image src={user.image} alt={user.name} width={32} height={32} className="size-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="size-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                    {(user.name || "U").charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-semibold">{user.name}</p>
                                                <p className="text-xs text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${user.role === "seller" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-700">{user.orders}</td>
                                    <td className="px-5 py-3.5 text-sm font-bold text-slate-900">${user.spent}</td>
                                    <td className="px-5 py-3.5 text-xs text-slate-500">{format(new Date(user.joinedAt), "MMM d, yyyy")}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${user.isBanned ? "bg-red-100 text-red-500" : "bg-primary/10 text-primary"}`}>
                                            <span className="material-symbols-outlined text-xs">{user.isBanned ? "block" : "check_circle"}</span>
                                            {user.isBanned ? "Banned" : "Active"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleViewUser(user)} className="text-slate-400 hover:text-[#4799eb] transition-colors" title="View Details">
                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                            </button>
                                            <button onClick={() => handleEditUser(user)} className="text-slate-400 hover:text-primary transition-colors" title="Edit User">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button onClick={() => confirmBan(user)} className={`text-[18px] transition-colors ${user.isBanned ? 'text-green-500 hover:text-green-600' : 'text-slate-400 hover:text-orange-500'}`} title={user.isBanned ? "Unban User" : "Ban User"}>
                                                <span className="material-symbols-outlined">{user.isBanned ? 'check_circle' : 'block'}</span>
                                            </button>
                                            <button onClick={() => confirmDelete(user)} className="text-slate-400 hover:text-red-500 transition-colors" title="Delete User">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-5 pb-4">
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
