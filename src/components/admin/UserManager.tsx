"use client";

import { useState, useEffect } from "react";
import {
  fetchAllUsers,
  updateUserRole,
  deleteUser,
} from "@/lib/courseData";
import type { UserProfile } from "@/context/AuthContext";
import {
  Search,
  Shield,
  ShieldOff,
  Trash2,
  Loader2,
  Users,
} from "lucide-react";

export default function UserManager() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
    setActionLoading(uid);
    try {
      await updateUserRole(uid, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Failed to update role:", err);
    }
    setActionLoading(null);
  };

  const handleDelete = async (uid: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setActionLoading(uid);
    try {
      await deleteUser(uid);
      setUsers((prev) => prev.filter((u) => u.uid !== uid));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
    setActionLoading(null);
  };

  const filtered = users.filter(
    (u) =>
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name, username, or email..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-text-muted">
        <span className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          {users.length} total users
        </span>
        <span>
          {users.filter((u) => u.role === "superadmin").length} admins
        </span>
      </div>

      {/* User list */}
      <div className="space-y-3">
        {filtered.map((user) => (
          <div
            key={user.uid}
            className="glass-card rounded-xl p-4 flex items-center gap-4"
          >
            <img
              src={user.photoURL || ""}
              alt={user.displayName}
              className="w-10 h-10 rounded-full border-2 border-white/20"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-primary truncate">
                {user.displayName}
              </p>
              <p className="text-xs text-text-muted truncate">
                @{user.username} · {user.email}
              </p>
            </div>

            {/* Role badge */}
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                user.role === "superadmin"
                  ? "bg-brand-purple/10 text-brand-purple border border-brand-purple/20"
                  : "bg-gray-100 dark:bg-white/5 text-text-muted border border-gray-200 dark:border-white/10"
              }`}
            >
              {user.role}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {actionLoading === user.uid ? (
                <Loader2 className="w-4 h-4 animate-spin text-text-muted" />
              ) : (
                <>
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
                      title="Promote to superadmin"
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user.uid)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                    title="Delete user"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-text-muted py-10 text-sm">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
}
