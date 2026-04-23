"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import {
  Bell,
  BellOff,
  Plus,
  Trash2,
  Loader2,
  Megaphone,
  AlertTriangle,
  Info,
  CheckCircle,
  Zap,
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "urgent";
  active: boolean;
  createdAt: string;
  createdBy: string;
}

const typeConfig = {
  info: { label: "Info", icon: Info, color: "text-brand-blue", bg: "bg-brand-blue/10 border-brand-blue/20" },
  warning: { label: "Warning", icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20" },
  success: { label: "Success", icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
  urgent: { label: "Urgent", icon: Zap, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
};

export default function Announcements() {
  const { userProfile } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "info" as Announcement["type"],
    active: true,
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const snap = await getDocs(query(collection(db, "announcements"), orderBy("createdAt", "desc")));
      setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement)));
    } catch (err) {
      console.error("Failed to load announcements:", err);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.message.trim()) return;
    setSaving(true);
    try {
      const id = `ann_${Date.now()}`;
      const ann: Announcement = {
        id,
        ...form,
        createdAt: new Date().toISOString(),
        createdBy: userProfile?.displayName || "Admin",
      };
      await setDoc(doc(db, "announcements", id), ann);
      setAnnouncements((prev) => [ann, ...prev]);
      setForm({ title: "", message: "", type: "info", active: true });
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create announcement:", err);
    }
    setSaving(false);
  };

  const handleToggle = async (ann: Announcement) => {
    try {
      await setDoc(doc(db, "announcements", ann.id), { ...ann, active: !ann.active });
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === ann.id ? { ...a, active: !a.active } : a))
      );
    } catch (err) {
      console.error("Failed to toggle announcement:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await deleteDoc(doc(db, "announcements", id));
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-brand-purple" />
            Broadcast Announcements
          </h3>
          <p className="text-xs text-text-muted mt-0.5">Active announcements appear as banners for all users</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-bold shadow-lg hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          New
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="glass-card rounded-2xl p-5 border border-brand-purple/20 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text-muted mb-1.5 block">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Announcement title..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text-muted mb-1.5 block">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Announcement["type"] }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
              >
                {Object.entries(typeConfig).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-text-muted mb-1.5 block">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Write your announcement message..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-purple/50 resize-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="rounded"
              />
              Publish immediately
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-text-muted hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-brand text-white text-sm font-bold disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-brand-blue" /></div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-40" />
          <p className="text-text-muted text-sm">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((ann) => {
            const cfg = typeConfig[ann.type];
            const Icon = cfg.icon;
            return (
              <div key={ann.id} className={`glass-card rounded-xl p-4 border ${ann.active ? cfg.bg : "border-gray-200 dark:border-white/10 opacity-50"}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ann.active ? cfg.bg : "bg-gray-100 dark:bg-white/5"}`}>
                    <Icon className={`w-4 h-4 ${ann.active ? cfg.color : "text-text-muted"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-text-primary">{ann.title}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ann.active ? cfg.bg + " " + cfg.color : "bg-gray-100 dark:bg-white/5 text-text-muted border-gray-200 dark:border-white/10"}`}>
                        {ann.active ? "LIVE" : "DRAFT"}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">{ann.message}</p>
                    <p className="text-[10px] text-text-muted mt-1.5">
                      Created by {ann.createdBy} · {new Date(ann.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleToggle(ann)}
                      className={`p-2 rounded-lg transition-colors ${ann.active ? "hover:bg-yellow-500/10 text-yellow-500" : "hover:bg-green-500/10 text-green-400"}`}
                      title={ann.active ? "Deactivate" : "Activate"}
                    >
                      {ann.active ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
