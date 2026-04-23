"use client";

import { useState, useEffect } from "react";
import {
  fetchAllUsers,
  updateUserRole,
  deleteUser,
  updateUserBanned,
} from "@/lib/courseData";
import type { UserProfile } from "@/context/AuthContext";
import {
  Search,
  Shield,
  ShieldOff,
  Trash2,
  Loader2,
  Users,
  UserX,
  UserCheck,
  Download,
  ChevronDown,
  ChevronUp,
  Mail,
  Calendar,
  Hash,
} from "lucide-react";

type FilterRole = "all" | "user" | "superadmin" | "banned";

export default function UserManager() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<FilterRole>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data as UserProfile[]);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
    setLoading(false);
  };

  const handleRoleChange = async (uid: string, newRole: "user" | "superadmin") => {
    setActionLoading(uid + "_role");
    try {
      await updateUserRole(uid, newRole);
      setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u)));
    } catch (err) {
      console.error("Failed to update role:", err);
    }
    setActionLoading(null);
  };

  const handleBanToggle = async (uid: string, currentBanned: boolean) => {
    if (!currentBanned && !confirm("Ban this user? They won't be able to access the platform.")) return;
    setActionLoading(uid + "_ban");
    try {
      await updateUserBanned(uid, !currentBanned);
      setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, banned: !currentBanned } : u)));
    } catch (err) {
      console.error("Failed to update ban status:", err);
    }
    setActionLoading(null);
  };

  const handleDelete = async (uid: string, name: string) => {
    if (!confirm(`Permanently delete "${name}"? This cannot be undone.`)) return;
    setActionLoading(uid + "_del");
    try {
      await deleteUser(uid);
      setUsers((prev) => prev.filter((u) => u.uid !== uid));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
    setActionLoading(null);
  };

  const exportCSV = () => {
    const rows = [
      ["Name", "Username", "Email", "Role", "Banned", "Joined"],
      ...filtered.map((u) => [
        u.displayName,
        u.username,
        u.email,
        u.role,
        (u as any).banned ? "Yes" : "No",
        u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—",
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `adisource_users_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u.displayName?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q);
    const matchRole =
      filterRole === "all"
        ? true
        : filterRole === "banned"
        ? (u as any).banned
        : u.role === filterRole;
    return matchSearch && matchRole;
  });

  const filterTabs: { id: FilterRole; label: string; count: number }[] = [
    { id: "all", label: "All", count: users.length },
    { id: "user", label: "Users", count: users.filter((u) => u.role === "user").length },
    { id: "superadmin", label: "Admins", count: users.filter((u) => u.role === "superadmin").length },
    { id: "banned", label: "Banned", count: users.filter((u) => (u as any).banned).length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, username or email..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
          />
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/5 transition-all"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterRole(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filterRole === tab.id
                ? "gradient-brand text-white shadow-md"
                : "bg-white/50 dark:bg-white/5 text-text-muted hover:text-text-primary border border-gray-200 dark:border-white/10"
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filterRole === tab.id ? "bg-white/20" : "bg-gray-100 dark:bg-white/10"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* User List */}
      <div className="space-y-2">
        {filtered.map((user) => {
          const isBanned = (user as any).banned;
          const isExpanded = expandedUser === user.uid;
          const isActing = actionLoading?.startsWith(user.uid);

          return (
            <div
              key={user.uid}
              className={`glass-card rounded-xl overflow-hidden transition-all duration-300 ${isBanned ? "opacity-60 border border-red-400/20" : ""}`}
            >
              {/* Main Row */}
              <div className="flex items-center gap-3 p-4">
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full border-2 border-white/20 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-text-primary truncate">{user.displayName}</p>
                    {isBanned && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-400/20">
                        BANNED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted truncate">@{user.username} · {user.email}</p>
                </div>

                <span className={`hidden sm:block text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                  user.role === "superadmin"
                    ? "bg-brand-purple/10 text-brand-purple border border-brand-purple/20"
                    : "bg-gray-100 dark:bg-white/5 text-text-muted border border-gray-200 dark:border-white/10"
                }`}>
                  {user.role}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {isActing ? (
                    <Loader2 className="w-4 h-4 animate-spin text-text-muted" />
                  ) : (
                    <>
                      {/* Promote/Demote */}
                      {user.role === "superadmin" ? (
                        <button
                          onClick={() => handleRoleChange(user.uid, "user")}
                          className="p-2 rounded-lg hover:bg-yellow-500/10 text-yellow-500 transition-colors"
                          title="Demote to user"
                        >
                          <ShieldOff className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(user.uid, "superadmin")}
                          className="p-2 rounded-lg hover:bg-brand-purple/10 text-brand-purple transition-colors"
                          title="Promote to admin"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                      )}

                      {/* Ban/Unban */}
                      <button
                        onClick={() => handleBanToggle(user.uid, isBanned)}
                        className={`p-2 rounded-lg transition-colors ${
                          isBanned
                            ? "hover:bg-green-500/10 text-green-400"
                            : "hover:bg-red-500/10 text-red-400"
                        }`}
                        title={isBanned ? "Unban user" : "Ban user"}
                      >
                        {isBanned ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(user.uid, user.displayName)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Expand */}
                  <button
                    onClick={() => setExpandedUser(isExpanded ? null : user.uid)}
                    className="p-2 rounded-lg hover:bg-white/10 text-text-muted transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-white/5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{user.email || "No email"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Hash className="w-3.5 h-3.5" />
                      <span className="font-mono">{user.uid.slice(0, 16)}…</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "Unknown"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-40" />
            <p className="text-text-muted text-sm">No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
