"use client";

import { useState } from "react";
import { useCourseData } from "@/context/CourseDataContext";
import { updateSemester } from "@/lib/courseData";
import { Settings, Loader2, Check } from "lucide-react";

export default function PlatformSettings() {
  const { semesters, refresh } = useCourseData();
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const handleStatusChange = async (
    semId: number,
    newStatus: string
  ) => {
    setSaving(String(semId));
    try {
      await updateSemester(semId, { status: newStatus });
      await refresh();
      setSaved(String(semId));
      setTimeout(() => setSaved(null), 2000);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
    setSaving(null);
  };

  return (
    <div className="space-y-8">
      {/* Semester Status Management */}
      <div>
        <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-text-muted" />
          Semester Status
        </h3>
        <div className="space-y-3">
          {semesters.map((sem) => (
            <div
              key={sem.id}
              className="flex items-center gap-4 px-5 py-4 glass-card rounded-xl"
            >
              <span className="text-sm font-bold text-text-primary flex-1">
                {sem.label}
              </span>
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
              {saving === String(sem.id) && (
                <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
              )}
              {saved === String(sem.id) && (
                <Check className="w-4 h-4 text-green-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="glass-card rounded-xl p-6">
        <p className="text-sm text-text-secondary leading-relaxed">
          <strong className="text-text-primary">Admin Key:</strong> The super
          admin key is configured in your <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-xs">.env.local</code> file
          as <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-xs">NEXT_PUBLIC_ADMIN_KEY</code>. Change it there and
          restart the server to update.
        </p>
      </div>
    </div>
  );
}
