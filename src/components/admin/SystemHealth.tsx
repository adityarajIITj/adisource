"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { invalidateCache } from "@/lib/courseData";
import {
  Cpu,
  Database,
  Wifi,
  AlertTriangle,
  Trash2,
  Loader2,
  CheckCircle,
  RefreshCw,
  ShieldAlert,
  Info,
} from "lucide-react";

export default function SystemHealth() {
  const [firebaseOk, setFirebaseOk] = useState<boolean | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [dangerLoading, setDangerLoading] = useState(false);
  const [dangerDone, setDangerDone] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    runHealthCheck();
  }, []);

  const runHealthCheck = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      setUserCount(snap.size);
      setFirebaseOk(true);
    } catch {
      setFirebaseOk(false);
    }
    setLoading(false);
  };

  const handlePurgeNonAdmins = async () => {
    if (confirmText !== "DELETE ALL USERS") {
      alert('Type "DELETE ALL USERS" to confirm');
      return;
    }
    if (!confirm("⚠️ This will permanently delete ALL non-admin users. Are you absolutely sure?")) return;

    setDangerLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      const batch = writeBatch(db);
      let count = 0;
      for (const d of snap.docs) {
        const data = d.data();
        if (data.role !== "superadmin") {
          batch.delete(d.ref);
          // Also delete username reservation
          if (data.username) {
            batch.delete(doc(db, "usernames", data.username));
          }
          count++;
        }
      }
      await batch.commit();
      invalidateCache();
      setDangerDone(`Deleted ${count} users.`);
      setConfirmText("");
      await runHealthCheck();
    } catch (err) {
      console.error("Failed to purge users:", err);
      alert("Operation failed. Check console.");
    }
    setDangerLoading(false);
  };

  const handlePurgeAnnouncements = async () => {
    if (!confirm("Delete ALL announcements?")) return;
    setDangerLoading(true);
    try {
      const snap = await getDocs(collection(db, "announcements"));
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      setDangerDone("All announcements deleted.");
    } catch (err) {
      console.error(err);
    }
    setDangerLoading(false);
  };

  const StatusBadge = ({ ok }: { ok: boolean | null }) => {
    if (ok === null) return <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />;
    return (
      <div className={`w-2 h-2 rounded-full ${ok ? "bg-green-400" : "bg-red-400"}`} />
    );
  };

  return (
    <div className="space-y-8">
      {/* System Status */}
      <div>
        <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-text-muted" />
          System Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Firebase */}
          <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${firebaseOk ? "bg-green-400/10" : "bg-red-400/10"}`}>
              <Database className={`w-5 h-5 ${firebaseOk === null ? "text-yellow-400" : firebaseOk ? "text-green-400" : "text-red-400"}`} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <StatusBadge ok={firebaseOk} />
                <p className="text-sm font-bold text-text-primary">Firestore</p>
              </div>
              <p className="text-xs text-text-muted">{firebaseOk === null ? "Checking..." : firebaseOk ? "Connected" : "Error"}</p>
            </div>
          </div>

          {/* Network */}
          <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <p className="text-sm font-bold text-text-primary">Network</p>
              </div>
              <p className="text-xs text-text-muted">Online</p>
            </div>
          </div>

          {/* Users */}
          <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">
                {loading ? "—" : `${userCount} Users`}
              </p>
              <p className="text-xs text-text-muted">In database</p>
            </div>
          </div>
        </div>

        <button
          onClick={runHealthCheck}
          className="mt-3 flex items-center gap-2 text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Re-run health check
        </button>
      </div>

      {/* Platform Info */}
      <div>
        <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-text-muted" />
          Platform Info
        </h3>
        <div className="glass-card rounded-xl divide-y divide-white/5">
          {[
            { label: "Platform", value: "Adisource" },
            { label: "Stack", value: "Next.js 14 + Firebase + Netlify" },
            { label: "AI Engine", value: "Google Gemini 1.5 Flash" },
            { label: "Auth", value: "Firebase Authentication (Google OAuth)" },
            { label: "Database", value: "Cloud Firestore" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3">
              <span className="text-xs text-text-muted">{label}</span>
              <span className="text-xs font-semibold text-text-primary">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div>
        <h3 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          Danger Zone
        </h3>
        <div className="border border-red-400/20 rounded-2xl p-5 space-y-4 bg-red-400/5">
          <div className="flex items-start gap-2 text-xs text-red-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>These actions are <strong>irreversible</strong>. Proceed with extreme caution.</span>
          </div>

          {dangerDone && (
            <div className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              {dangerDone}
            </div>
          )}

          {/* Purge Non-Admin Users */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <div>
              <p className="text-sm font-bold text-text-primary">Delete All Non-Admin Users</p>
              <p className="text-xs text-text-muted mt-0.5">Permanently deletes all user accounts that don't have superadmin role</p>
            </div>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder='Type "DELETE ALL USERS" to confirm'
              className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-red-400/20 text-sm text-red-400 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-red-400/30 font-mono"
            />
            <button
              onClick={handlePurgeNonAdmins}
              disabled={dangerLoading || confirmText !== "DELETE ALL USERS"}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-400/20 text-sm font-bold hover:bg-red-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {dangerLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Purge All Users
            </button>
          </div>

          {/* Purge Announcements */}
          <div className="glass-card rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-text-primary">Clear All Announcements</p>
              <p className="text-xs text-text-muted mt-0.5">Delete every announcement from Firestore</p>
            </div>
            <button
              onClick={handlePurgeAnnouncements}
              disabled={dangerLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-400/20 text-sm font-bold hover:bg-red-500/20 transition-all disabled:opacity-40"
            >
              {dangerLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
