"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";

import {
  ArrowLeft,
  AtSign,
  Check,
  X,
  Loader2,
  Key,
  LogOut,
  Calendar,
  Mail,
  Shield,
  ShieldCheck,
  Sparkles,
  Edit3,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, userProfile, loading, logout, refreshProfile } = useAuth();
  const router = useRouter();

  // Username editing
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  const [usernameSubmitting, setUsernameSubmitting] = useState(false);

  // Admin key
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [keyStatus, setKeyStatus] = useState<"idle" | "error" | "success">("idle");
  const [keySubmitting, setKeySubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Username availability check
  const checkUsername = useCallback(
    async (name: string) => {
      if (name.length < 3) {
        setUsernameStatus("invalid");
        return;
      }
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(name)) {
        setUsernameStatus("invalid");
        return;
      }
      if (name.toLowerCase() === userProfile?.username) {
        setUsernameStatus("invalid");
        return;
      }

      setUsernameStatus("checking");
      try {
        const usernameDoc = await getDoc(doc(db, "usernames", name.toLowerCase()));
        setUsernameStatus(usernameDoc.exists() ? "taken" : "available");
      } catch {
        setUsernameStatus("idle");
      }
    },
    [userProfile?.username]
  );

  useEffect(() => {
    if (!newUsername) {
      setUsernameStatus("idle");
      return;
    }
    const timer = setTimeout(() => checkUsername(newUsername), 500);
    return () => clearTimeout(timer);
  }, [newUsername, checkUsername]);

  const handleUsernameUpdate = async () => {
    if (usernameStatus !== "available" || !user || !userProfile) return;

    setUsernameSubmitting(true);
    try {
      const lowerNew = newUsername.toLowerCase();

      // Check again
      const check = await getDoc(doc(db, "usernames", lowerNew));
      if (check.exists()) {
        setUsernameStatus("taken");
        setUsernameSubmitting(false);
        return;
      }

      // Delete old username reservation
      await deleteDoc(doc(db, "usernames", userProfile.username));

      // Reserve new username
      await setDoc(doc(db, "usernames", lowerNew), { uid: user.uid });

      // Update user profile
      await updateDoc(doc(db, "users", user.uid), { username: lowerNew });

      await refreshProfile();
      setEditingUsername(false);
      setNewUsername("");
      setUsernameStatus("idle");
    } catch (err) {
      console.error("Username update error:", err);
    }
    setUsernameSubmitting(false);
  };

  const handleAdminKey = async () => {
    if (!adminKey || !user) return;
    setKeySubmitting(true);

    const correctKey = process.env.NEXT_PUBLIC_ADMIN_KEY;
    if (adminKey === correctKey) {
      try {
        await updateDoc(doc(db, "users", user.uid), { role: "superadmin" });
        await refreshProfile();
        setKeyStatus("success");
        setShowKeyInput(false);
        setAdminKey("");
      } catch {
        setKeyStatus("error");
      }
    } else {
      setKeyStatus("error");
    }
    setKeySubmitting(false);
  };

  if (loading || !user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary">
        <div className="login-spinner" />
      </div>
    );
  }

  const memberSince = new Date(userProfile.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative min-h-screen bg-surface-primary overflow-hidden">

      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-6">
        <div className="mx-auto max-w-2xl">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Profile Card */}
          <div className="glass-card rounded-3xl p-8 mb-6">
            {/* Avatar + Name */}
            <div className="flex items-center gap-5 mb-8">
              <img
                src={user.photoURL || ""}
                alt={userProfile.displayName}
                className="w-20 h-20 rounded-full border-4 border-white/20 shadow-xl"
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className="text-2xl font-extrabold flex items-center gap-2">
                  {userProfile.displayName}
                  {userProfile.role === "superadmin" && (
                    <ShieldCheck className="w-5 h-5 text-brand-purple" />
                  )}
                </h1>
                <p className="text-text-muted text-sm">@{userProfile.username}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/30 dark:bg-white/5">
                <Mail className="w-4 h-4 text-brand-blue" />
                <div>
                  <p className="text-xs text-text-muted">Email</p>
                  <p className="text-sm font-medium text-text-primary truncate">
                    {userProfile.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/30 dark:bg-white/5">
                <Calendar className="w-4 h-4 text-brand-cyan" />
                <div>
                  <p className="text-xs text-text-muted">Member since</p>
                  <p className="text-sm font-medium text-text-primary">{memberSince}</p>
                </div>
              </div>
            </div>

            {/* Change Username */}
            <div className="border-t border-white/10 pt-6">
              {!editingUsername ? (
                <button
                  onClick={() => {
                    setEditingUsername(true);
                    setNewUsername("");
                    setUsernameStatus("idle");
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-brand-blue hover:text-brand-cyan transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Change Username
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) =>
                        setNewUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))
                      }
                      placeholder="new_username"
                      maxLength={20}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameStatus === "checking" && (
                        <Loader2 className="w-4 h-4 text-brand-blue animate-spin" />
                      )}
                      {usernameStatus === "available" && (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                      {usernameStatus === "taken" && <X className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUsernameUpdate}
                      disabled={usernameStatus !== "available" || usernameSubmitting}
                      className="btn-primary !py-2.5 !px-5 !text-sm !rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span>
                        {usernameSubmitting ? "Saving..." : "Save"}
                      </span>
                    </button>
                    <button
                      onClick={() => setEditingUsername(false)}
                      className="btn-secondary !py-2.5 !px-5 !text-sm !rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Admin Key Section */}
          {userProfile.role !== "superadmin" && (
            <div className="glass-card rounded-3xl p-8 mb-6">
              <button
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                <Key className="w-4 h-4" />
                Enter admin key
              </button>

              {showKeyInput && (
                <div className="mt-4 space-y-3">
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => {
                      setAdminKey(e.target.value);
                      setKeyStatus("idle");
                    }}
                    placeholder="Enter your admin key"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-purple/50 transition-all"
                  />
                  {keyStatus === "error" && (
                    <p className="text-red-500 text-xs font-medium">Invalid key</p>
                  )}
                  {keyStatus === "success" && (
                    <p className="text-green-500 text-xs font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Super admin access granted!
                    </p>
                  )}
                  <button
                    onClick={handleAdminKey}
                    disabled={!adminKey || keySubmitting}
                    className="btn-primary !py-2.5 !px-5 !text-sm !rounded-xl disabled:opacity-40"
                  >
                    <span>{keySubmitting ? "Verifying..." : "Verify Key"}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Super Admin Badge */}
          {userProfile.role === "superadmin" && (
            <div className="glass-card rounded-3xl p-6 mb-6 border-brand-purple/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-brand-purple to-brand-magenta flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Super Admin</p>
                  <p className="text-xs text-text-muted">
                    You have full administrative access
                  </p>
                </div>
                <Link
                  href="/admin"
                  className="ml-auto text-sm font-semibold text-brand-purple hover:text-brand-magenta transition-colors"
                >
                  Open Panel →
                </Link>
              </div>
            </div>
          )}

          {/* Stats Placeholder */}
          <div className="glass-card rounded-3xl p-8 mb-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-cyan" />
              Your Progress
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {["Lectures", "Notes", "Streak"].map((label) => (
                <div
                  key={label}
                  className="text-center px-4 py-5 rounded-xl bg-white/30 dark:bg-white/5"
                >
                  <p className="text-2xl font-extrabold text-text-muted">—</p>
                  <p className="text-xs text-text-muted mt-1">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-4 text-center">
              Progress tracking coming in v2.0 Part 2!
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-semibold text-red-400 hover:text-red-500 glass-card hover:shadow-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            Log out of adisource
          </button>
        </div>
      </main>
    </div>
  );
}
