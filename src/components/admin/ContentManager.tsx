"use client";

import { useState, useEffect } from "react";
import { useCourseData } from "@/context/CourseDataContext";
import {
  addSemester,
  updateSemester,
  deleteSemester,
  addSubject,
  deleteSubject,
  addWeek,
  deleteWeek,
  addMaterial,
  deleteMaterial,
} from "@/lib/courseData";
import type { Semester, Subject, Week } from "@/data/courses";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Loader2,
  FolderOpen,
  BookOpen,
  Calendar,
  FileText,
  X,
} from "lucide-react";

// ---- Modal Component ----
function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl usermenu-enter">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ContentManager() {
  const { semesters, refresh } = useCourseData();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [modal, setModal] = useState<{
    type: "semester" | "subject" | "week" | "material" | null;
    semId?: number;
    subjectCode?: string;
    weekId?: number;
  }>({ type: null });

  // Form states
  const [form, setForm] = useState<Record<string, string>>({});

  const toggle = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const openModal = (
    type: "semester" | "subject" | "week" | "material",
    context?: { semId?: number; subjectCode?: string; weekId?: number }
  ) => {
    setForm({});
    setModal({ type, ...context });
  };

  const closeModal = () => setModal({ type: null });

  const handleAdd = async () => {
    setActionLoading(true);
    try {
      switch (modal.type) {
        case "semester":
          await addSemester({
            id: parseInt(form.id || "0"),
            label: form.label || `Semester ${form.id}`,
            status: (form.status as "ongoing" | "upcoming" | "completed") || "upcoming",
          });
          break;

        case "subject":
          if (modal.semId) {
            await addSubject(modal.semId, {
              name: form.name || "",
              code: form.code || "",
              icon: form.icon || "📚",
              color: form.color || "from-blue-500 to-indigo-600",
            });
          }
          break;

        case "week":
          if (modal.semId && modal.subjectCode) {
            await addWeek(modal.semId, modal.subjectCode, {
              id: parseInt(form.id || "0"),
              title: form.title || `Week ${form.id} Lectures`,
            });
          }
          break;

        case "material":
          if (modal.semId && modal.subjectCode && modal.weekId) {
            const matId = `m-${form.fileName?.replace(/[^a-zA-Z0-9]/g, "") || Date.now()}`;
            await addMaterial(modal.semId, modal.subjectCode, modal.weekId, {
              id: matId,
              title: form.title || "",
              type: (form.type as "html" | "pdf") || "html",
              estimatedMinutes: parseInt(form.estimatedMinutes || "10"),
              dateAdded: new Date().toISOString().split("T")[0],
              fileName: form.fileName || "",
            });
          }
          break;
      }
      await refresh();
      closeModal();
    } catch (err) {
      console.error("Add error:", err);
    }
    setActionLoading(false);
  };

  const handleDeleteSemester = async (semId: number) => {
    if (!confirm(`Delete Semester ${semId} and ALL its content?`)) return;
    setActionLoading(true);
    await deleteSemester(semId);
    await refresh();
    setActionLoading(false);
  };

  const handleDeleteSubject = async (semId: number, code: string) => {
    if (!confirm(`Delete subject ${code} and all its content?`)) return;
    setActionLoading(true);
    await deleteSubject(semId, code);
    await refresh();
    setActionLoading(false);
  };

  const handleDeleteWeek = async (semId: number, code: string, weekId: number) => {
    if (!confirm(`Delete Week ${weekId} and all its materials?`)) return;
    setActionLoading(true);
    await deleteWeek(semId, code, weekId);
    await refresh();
    setActionLoading(false);
  };

  const handleDeleteMaterial = async (
    semId: number,
    code: string,
    weekId: number,
    matId: string
  ) => {
    if (!confirm("Delete this material?")) return;
    setActionLoading(true);
    await deleteMaterial(semId, code, weekId, matId);
    await refresh();
    setActionLoading(false);
  };

  const GRADIENT_OPTIONS = [
    "from-cyan-500 to-blue-600",
    "from-blue-500 to-indigo-600",
    "from-indigo-500 to-purple-600",
    "from-purple-500 to-pink-600",
    "from-pink-500 to-rose-600",
    "from-green-500 to-emerald-600",
    "from-orange-500 to-amber-600",
    "from-red-500 to-orange-600",
  ];

  return (
    <div className="space-y-4">
      {/* Add Semester Button */}
      <button
        onClick={() => openModal("semester")}
        className="flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-brand-cyan transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Semester
      </button>

      {actionLoading && (
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Loader2 className="w-3 h-3 animate-spin" /> Saving changes...
        </div>
      )}

      {/* Tree View */}
      {semesters.map((sem) => {
        const semKey = `sem-${sem.id}`;
        return (
          <div key={sem.id} className="glass-card rounded-xl overflow-hidden">
            {/* Semester Row */}
            <div
              className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-white/20 dark:hover:bg-white/5 transition-colors"
              onClick={() => toggle(semKey)}
            >
              {expanded[semKey] ? (
                <ChevronDown className="w-4 h-4 text-text-muted" />
              ) : (
                <ChevronRight className="w-4 h-4 text-text-muted" />
              )}
              <FolderOpen className="w-5 h-5 text-brand-blue" />
              <span className="text-sm font-bold text-text-primary flex-1">
                {sem.label}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  sem.status === "ongoing"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : sem.status === "upcoming"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {sem.status}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal("subject", { semId: sem.id });
                }}
                className="p-1 rounded hover:bg-brand-blue/10 text-brand-blue"
                title="Add Subject"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSemester(sem.id);
                }}
                className="p-1 rounded hover:bg-red-500/10 text-red-400"
                title="Delete Semester"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Expanded: Subjects */}
            {expanded[semKey] && (
              <div className="border-t border-white/10">
                {sem.subjects.length === 0 ? (
                  <p className="text-xs text-text-muted px-10 py-4">
                    No subjects yet. Click + to add one.
                  </p>
                ) : (
                  sem.subjects.map((sub) => {
                    const subKey = `${semKey}-${sub.code}`;
                    return (
                      <div key={sub.code}>
                        <div
                          className="flex items-center gap-3 px-10 py-3 cursor-pointer hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                          onClick={() => toggle(subKey)}
                        >
                          {expanded[subKey] ? (
                            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
                          )}
                          <span className="text-lg">{sub.icon}</span>
                          <BookOpen className="w-4 h-4 text-brand-purple" />
                          <span className="text-sm font-semibold text-text-primary flex-1 truncate">
                            {sub.name}
                          </span>
                          <span className="text-xs text-text-muted font-mono">
                            {sub.code}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal("week", {
                                semId: sem.id,
                                subjectCode: sub.code,
                              });
                            }}
                            className="p-1 rounded hover:bg-brand-purple/10 text-brand-purple"
                            title="Add Week"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSubject(sem.id, sub.code);
                            }}
                            className="p-1 rounded hover:bg-red-500/10 text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Expanded: Weeks */}
                        {expanded[subKey] &&
                          sub.weeks.map((week) => {
                            const weekKey = `${subKey}-w${week.id}`;
                            return (
                              <div key={week.id}>
                                <div
                                  className="flex items-center gap-3 px-16 py-2.5 cursor-pointer hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                                  onClick={() => toggle(weekKey)}
                                >
                                  {expanded[weekKey] ? (
                                    <ChevronDown className="w-3 h-3 text-text-muted" />
                                  ) : (
                                    <ChevronRight className="w-3 h-3 text-text-muted" />
                                  )}
                                  <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
                                  <span className="text-xs font-medium text-text-secondary flex-1">
                                    {week.title}
                                  </span>
                                  <span className="text-xs text-text-muted">
                                    {week.materials.length} files
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openModal("material", {
                                        semId: sem.id,
                                        subjectCode: sub.code,
                                        weekId: week.id,
                                      });
                                    }}
                                    className="p-1 rounded hover:bg-brand-cyan/10 text-brand-cyan"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteWeek(sem.id, sub.code, week.id);
                                    }}
                                    className="p-1 rounded hover:bg-red-500/10 text-red-400"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* Expanded: Materials */}
                                {expanded[weekKey] &&
                                  week.materials.map((mat) => (
                                    <div
                                      key={mat.id}
                                      className="flex items-center gap-3 px-22 py-2 hover:bg-white/5 transition-colors"
                                      style={{ paddingLeft: "5.5rem" }}
                                    >
                                      <FileText className="w-3 h-3 text-text-muted" />
                                      <span className="text-xs text-text-secondary flex-1 truncate">
                                        {mat.title} — {mat.fileName}
                                      </span>
                                      <span className="text-xs text-text-muted">
                                        {mat.estimatedMinutes}m
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleDeleteMaterial(
                                            sem.id,
                                            sub.code,
                                            week.id,
                                            mat.id
                                          )
                                        }
                                        className="p-1 rounded hover:bg-red-500/10 text-red-400"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                              </div>
                            );
                          })}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}

      {semesters.length === 0 && (
        <div className="text-center py-16 glass-card rounded-xl">
          <p className="text-text-muted text-sm mb-2">No semesters in Firestore yet.</p>
          <p className="text-xs text-text-muted">
            Run the seed script or add semesters manually above.
          </p>
        </div>
      )}

      {/* ---- MODALS ---- */}

      {/* Add Semester Modal */}
      <Modal open={modal.type === "semester"} onClose={closeModal} title="Add Semester">
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Semester number (e.g. 3)"
            value={form.id || ""}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
          />
          <input
            type="text"
            placeholder="Label (e.g. Semester 3)"
            value={form.label || ""}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
          />
          <select
            value={form.status || "upcoming"}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={handleAdd} disabled={actionLoading} className="w-full btn-primary !py-3 !rounded-xl">
            <span>{actionLoading ? "Adding..." : "Add Semester"}</span>
          </button>
        </div>
      </Modal>

      {/* Add Subject Modal */}
      <Modal open={modal.type === "subject"} onClose={closeModal} title="Add Subject">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Subject name"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
          />
          <input
            type="text"
            placeholder="Code (e.g. ATA, BDA)"
            value={form.code || ""}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
          />
          <input
            type="text"
            placeholder="Icon (emoji, e.g. 🧠)"
            value={form.icon || ""}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
          />
          <div>
            <label className="text-xs font-medium text-text-muted mb-2 block">
              Gradient Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {GRADIENT_OPTIONS.map((g) => (
                <button
                  key={g}
                  onClick={() => setForm({ ...form, color: g })}
                  className={`h-8 rounded-lg bg-gradient-to-r ${g} border-2 transition-all ${
                    form.color === g
                      ? "border-white scale-110 shadow-lg"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
          <button onClick={handleAdd} disabled={actionLoading} className="w-full btn-primary !py-3 !rounded-xl">
            <span>{actionLoading ? "Adding..." : "Add Subject"}</span>
          </button>
        </div>
      </Modal>

      {/* Add Week Modal */}
      <Modal open={modal.type === "week"} onClose={closeModal} title="Add Week">
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Week number"
            value={form.id || ""}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
          />
          <input
            type="text"
            placeholder="Title (e.g. Week 3 Lectures)"
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
          />
          <button onClick={handleAdd} disabled={actionLoading} className="w-full btn-primary !py-3 !rounded-xl">
            <span>{actionLoading ? "Adding..." : "Add Week"}</span>
          </button>
        </div>
      </Modal>

      {/* Add Material Modal */}
      <Modal open={modal.type === "material"} onClose={closeModal} title="Add Material">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title (e.g. W3L1)"
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
          />
          <input
            type="text"
            placeholder="File name (e.g. ATAW3L1.html)"
            value={form.fileName || ""}
            onChange={(e) => setForm({ ...form, fileName: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
          />
          <select
            value={form.type || "html"}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
          >
            <option value="html">HTML</option>
            <option value="pdf">PDF</option>
            <option value="slides">Slides</option>
            <option value="video">Video</option>
            <option value="notes">Notes</option>
          </select>
          <input
            type="number"
            placeholder="Estimated minutes"
            value={form.estimatedMinutes || ""}
            onChange={(e) => setForm({ ...form, estimatedMinutes: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
          />
          <button onClick={handleAdd} disabled={actionLoading} className="w-full btn-primary !py-3 !rounded-xl">
            <span>{actionLoading ? "Adding..." : "Add Material"}</span>
          </button>
        </div>
      </Modal>
    </div>
  );
}
