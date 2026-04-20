"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCourseData } from "@/context/CourseDataContext";
import { useAuth } from "@/hooks/useAuth";
import { getAllBestScores, hasCompletedQuiz } from "@/lib/quizStorage";
import { getSubjectProgress, getSemesterProgress } from "@/lib/progressStorage";
import {
  ChevronRight, ChevronDown, Trophy, Sparkles, Lock,
  CheckCircle2, Circle, ArrowLeft, PenTool, Settings, AlertCircle
} from "lucide-react";

// Dummy upcoming semesters
const upcomingSemesters = [
  { id: 3, label: "Semester 3", status: "upcoming" as const, subjects: [] },
  { id: 4, label: "Semester 4", status: "upcoming" as const, subjects: [] },
];

export default function QuizHubPage() {
  const { semesters: firestoreSemesters, loading: dataLoading } = useCourseData();
  const { user, userProfile } = useAuth();
  const [bestScores, setBestScores] = useState<Record<string, number>>({});
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [mounted, setMounted] = useState(false);

  const allSemesters = [
    ...firestoreSemesters,
    ...upcomingSemesters.filter((up) => !firestoreSemesters.some((fs) => fs.id === up.id)),
  ].sort((a, b) => a.id - b.id);

  const [activeSem, setActiveSem] = useState(
    firestoreSemesters.length > 0 ? firestoreSemesters[0]?.id || 1 : 1
  );
  const currentSem = allSemesters.find((s) => s.id === activeSem) || allSemesters[0];

  useEffect(() => {
    setMounted(true);
    setBestScores(getAllBestScores());
    setHasApiKey(!!localStorage.getItem("gemini_api_key"));
  }, []);

  useEffect(() => {
    if (firestoreSemesters.length > 0 && !firestoreSemesters.some(s => s.id === activeSem)) {
      setActiveSem(firestoreSemesters[0].id);
    }
  }, [firestoreSemesters, activeSem]);

  if (!user || !userProfile) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-6 pt-24">
          <div className="text-center glass-card rounded-3xl p-12 max-w-md">
            <Lock className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text-primary mb-2">Sign In Required</h2>
            <p className="text-text-secondary mb-6">Please sign in to access quizzes.</p>
            <Link href="/login?redirect=/quiz" className="btn-primary"><span>Sign In</span></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col pt-24">
      <Navbar />

      <main className="flex-grow px-6 pb-24">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="mb-8 flex items-center gap-4 text-sm text-text-muted">
            <Link href="/" className="hover:text-brand-blue flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
          </div>

          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta flex items-center justify-center shadow-lg shadow-brand-purple/20">
                <PenTool className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary">
              AI <span className="gradient-text">Quizzes</span>
            </h1>
            <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
              Test your knowledge with AI-generated quizzes for every subject, every week. Generated from your actual lecture content.
            </p>
          </div>

          {/* AI Setup Status */}
          {mounted && !hasApiKey && (
            <div className="mb-10 p-5 rounded-2xl bg-brand-purple/5 border border-brand-purple/20 flex flex-col sm:flex-row items-center justify-between gap-4 quiz-card-enter">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-brand-purple" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary">AI Setup Required</h3>
                  <p className="text-sm text-text-secondary">To generate personalized quizzes, please add your Gemini API key.</p>
                </div>
              </div>
              <Link href="/settings" className="btn-secondary !py-2.5 !px-6 flex items-center gap-2 whitespace-nowrap">
                <Settings className="w-4 h-4" />
                Configure AI
              </Link>
            </div>
          )}

          {/* Semester Switcher */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="glass-card rounded-2xl p-1.5 inline-flex flex-wrap justify-center gap-1">
              {allSemesters.map((sem) => (
                <button
                  key={sem.id}
                  onClick={() => {
                    if (sem.status !== "upcoming") setActiveSem(sem.id);
                  }}
                  disabled={sem.status === "upcoming"}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeSem === sem.id
                      ? "gradient-brand text-white shadow-lg"
                      : sem.status === "upcoming"
                      ? "text-text-muted cursor-not-allowed opacity-50"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/50"
                  }`}
                >
                  {sem.label}
                  {sem.status === "upcoming" && (
                    <span className="ml-1.5 text-xs font-normal opacity-60">Soon</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Semester Progress Bar */}
          {mounted && currentSem && currentSem.subjects.length > 0 && (
            <div className="mb-10 glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-text-primary">
                  {currentSem.status === "completed" ? "✅ Semester Completed" : "Semester Progress"}
                </span>
                <span className="text-sm font-bold text-brand-blue">
                  {getSemesterProgress(currentSem.status as any, currentSem.subjects)}%
                </span>
              </div>
              <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full quiz-progress-bar transition-all duration-1000 ease-out"
                  style={{ width: `${getSemesterProgress(currentSem.status as any, currentSem.subjects)}%` }}
                />
              </div>
            </div>
          )}

          {/* Subject Cards */}
          {dataLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card rounded-2xl p-7 animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
                    <div className="w-16 h-6 rounded-lg bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="w-3/4 h-5 rounded bg-gray-200 dark:bg-gray-700 mb-3" />
                  <div className="w-1/3 h-4 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          ) : currentSem && currentSem.subjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {currentSem.subjects.map((subject) => {
                const isExpanded = expandedSubject === subject.code;
                const totalMaterials = subject.weeks.reduce((sum, w) => sum + w.materials.length, 0);
                const totalWeeks = subject.weeks.length;
                const subjectProg = mounted
                  ? currentSem.status === "completed" ? 100 : getSubjectProgress(subject.code, totalMaterials, totalWeeks)
                  : 0;
                const quizzedWeeks = subject.weeks.filter(w => bestScores[`${subject.code}-${w.id}`] !== undefined).length;

                return (
                  <div key={subject.code} className="glass-card rounded-2xl overflow-hidden transition-all duration-300">
                    {/* Subject Header */}
                    <button
                      onClick={() => setExpandedSubject(isExpanded ? null : subject.code)}
                      className="w-full p-6 flex items-center justify-between text-left hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{subject.icon}</span>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-lg bg-gradient-to-r ${subject.color} text-white`}>
                              {subject.code}
                            </span>
                            <span className="text-xs text-text-muted">
                              {quizzedWeeks}/{totalWeeks} weeks quizzed
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-text-primary">{subject.name}</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Mini progress */}
                        <div className="hidden sm:flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                            <div
                              className="h-full rounded-full quiz-progress-bar transition-all duration-700"
                              style={{ width: `${subjectProg}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-text-muted w-8">{subjectProg}%</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    {/* Expanded Week List */}
                    {isExpanded && (
                      <div className="px-6 pb-6 border-t border-gray-200/50 dark:border-white/10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                          {subject.weeks.map((week) => {
                            const scoreKey = `${subject.code}-${week.id}`;
                            const best = bestScores[scoreKey];
                            const hasBest = best !== undefined;

                            return (
                              <Link
                                key={week.id}
                                href={`/quiz/${subject.code.toLowerCase()}/${week.id}`}
                                className={`group relative p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                                  hasBest
                                    ? "border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20"
                                    : "border-gray-200 dark:border-white/10 bg-surface-secondary hover:border-brand-purple/40"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-bold text-text-primary">Week {week.id}</span>
                                  {hasBest ? (
                                    <div className="flex items-center gap-1">
                                      <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                                      <span className="text-xs font-bold text-green-600 dark:text-green-400">{best}/10</span>
                                    </div>
                                  ) : (
                                    <Sparkles className="w-4 h-4 text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                                  )}
                                </div>
                                <p className="text-xs text-text-muted">
                                  {week.materials.length} lecture{week.materials.length !== 1 ? "s" : ""}
                                </p>
                                {hasBest ? (
                                  <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Completed</span>
                                  </div>
                                ) : (
                                  <div className="mt-2 flex items-center gap-1 text-xs text-text-muted group-hover:text-brand-purple transition-colors">
                                    <Circle className="w-3 h-3" />
                                    <span>Take Quiz</span>
                                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                                  </div>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 glass-card rounded-2xl">
              <p className="text-text-muted text-lg">🚧 Quizzes for this semester are coming soon!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
