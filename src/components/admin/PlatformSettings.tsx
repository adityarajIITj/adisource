"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { invalidateCache } from "@/lib/courseData";
import { useCourseData } from "@/context/CourseDataContext";
import {
  Settings,
  Loader2,
  Check,
  Shield,
  Lock,
  Unlock,
  Wrench,
  RefreshCw,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface PlatformConfig {
  maintenanceMode: boolean;
  registrationOpen: boolean;
  maintenanceMessage: string;
}

const DEFAULT_CONFIG: PlatformConfig = {
  maintenanceMode: false,
  registrationOpen: true,
  maintenanceMessage: "Platform is under maintenance. Please check back soon.",
};

export default function PlatformSettings() {
  const { semesters, refreshData } = useCourseData();
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [config, setConfig] = useState<PlatformConfig>(DEFAULT_CONFIG);
  const [configLoading, setConfigLoading] = useState(true);
  const [cacheCleared, setCacheCleared] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const snap = await getDoc(doc(db, "platformSettings", "config"));
      if (snap.exists()) setConfig({ ...DEFAULT_CONFIG, ...snap.data() } as PlatformConfig);
    } catch (err) {
      console.error("Failed to load config:", err);
    }
    setConfigLoading(false);
  };

  const saveConfig = async (updates: Partial<PlatformConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    try {
      await setDoc(doc(db, "platformSettings", "config"), newConfig);
    } catch (err) {
      console.error("Failed to save config:", err);
      setConfig(config); // revert
    }
  };

  const handleStatusChange = async (semId: number, newStatus: string) => {
    const { updateSemester } = await import("@/lib/courseData");
    setSaving(String(semId));
    try {
      await updateSemester(semId, { status: newStatus });
      await refreshData();
      setSaved(String(semId));
      setTimeout(() => setSaved(null), 2000);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
    setSaving(null);
  };

  const handleClearCache = () => {
    invalidateCache();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 3000);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)} className="transition-all">
      {value ? (
        <ToggleRight className="w-8 h-8 text-green-400" />
      ) : (
        <ToggleLeft className="w-8 h-8 text-text-muted" />
      )}
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Platform Controls */}
      <div>
        <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-text-muted" />
          Platform Controls
        </h3>
        {configLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-brand-blue" /></div>
        ) : (
          <div className="space-y-3">
            {/* Maintenance Mode */}
            <div className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.maintenanceMode ? "bg-yellow-500/10" : "bg-white/10"}`}>
                <Wrench className={`w-5 h-5 ${config.maintenanceMode ? "text-yellow-500" : "text-text-muted"}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-text-primary">Maintenance Mode</p>
                <p className="text-xs text-text-muted">Blocks all users (except admins) from accessing the platform</p>
              </div>
              <Toggle value={config.maintenanceMode} onChange={(v) => saveConfig({ maintenanceMode: v })} />
            </div>

            {config.maintenanceMode && (
              <div className="glass-card rounded-xl p-4 ml-4 border border-yellow-500/20">
                <label className="text-xs font-bold text-text-muted mb-2 block">Maintenance Message</label>
                <input
                  type="text"
                  value={config.maintenanceMessage}
                  onChange={(e) => setConfig((c) => ({ ...c, maintenanceMessage: e.target.value }))}
                  onBlur={() => saveConfig({ maintenanceMessage: config.maintenanceMessage })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-yellow-500/20 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                />
              </div>
            )}

            {/* Registration */}
            <div className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.registrationOpen ? "bg-green-400/10" : "bg-red-400/10"}`}>
                {config.registrationOpen ? (
                  <Unlock className="w-5 h-5 text-green-400" />
                ) : (
                  <Lock className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-text-primary">
                  Registration {config.registrationOpen ? "Open" : "Closed"}
                </p>
                <p className="text-xs text-text-muted">
                  {config.registrationOpen
                    ? "New users can sign up freely"
                    : "New sign-ups are blocked — invite only"}
                </p>
              </div>
              <Toggle value={config.registrationOpen} onChange={(v) => saveConfig({ registrationOpen: v })} />
            </div>
          </div>
        )}
      </div>

      {/* Semester Status */}
      <div>
        <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-text-muted" />
          Semester Status
        </h3>
        <div className="space-y-3">
          {semesters.map((sem) => (
            <div key={sem.id} className="flex items-center gap-4 px-5 py-4 glass-card rounded-xl">
              <span className="text-sm font-bold text-text-primary flex-1">{sem.label}</span>
              <select
                value={sem.status}
                onChange={(e) => handleStatusChange(sem.id, e.target.value)}
                disabled={saving === String(sem.id)}
                className="px-3 py-2 rounded-lg bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
              {saving === String(sem.id) && <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />}
              {saved === String(sem.id) && <Check className="w-4 h-4 text-green-500" />}
            </div>
          ))}
        </div>
      </div>

      {/* Cache & Performance */}
      <div>
        <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-text-muted" />
          Cache & Performance
        </h3>
        <div className="glass-card rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-text-primary">Course Data Cache</p>
            <p className="text-xs text-text-muted mt-0.5">Clears the local 5-min cache and forces a fresh Firestore reload</p>
          </div>
          <button
            onClick={handleClearCache}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              cacheCleared
                ? "bg-green-500/10 text-green-400 border border-green-400/20"
                : "border border-gray-200 dark:border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/5"
            }`}
          >
            {cacheCleared ? (
              <><Check className="w-4 h-4" /> Cleared!</>
            ) : (
              <><RefreshCw className="w-4 h-4" /> Clear Cache</>
            )}
          </button>
        </div>
      </div>

      {/* Security Info */}
      <div className="glass-card rounded-xl p-5 border border-brand-purple/10">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-brand-purple" />
          <p className="text-sm font-bold text-text-primary">Admin Key</p>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          The super admin key is configured via{" "}
          <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">NEXT_PUBLIC_ADMIN_KEY</code>{" "}
          in your environment variables. Rotate it in Netlify → Site Settings → Environment Variables.
        </p>
      </div>
    </div>
  );
}
