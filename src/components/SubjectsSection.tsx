"use client";

import { useState, useRef, useEffect } from "react";
import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { semesters } from "@/data/courses";

// Add dummy upcoming semesters for UI completeness
const allSemesters = [
  ...semesters,
  {
    id: 3,
    label: "Semester 3",
    status: "upcoming" as const,
    subjects: [],
  },
  {
    id: 4,
    label: "Semester 4",
    status: "upcoming" as const,
    subjects: [],
  },
];

export default function SubjectsSection() {
  const [activeSem, setActiveSem] = useState(1);
  const currentSem = allSemesters.find((s) => s.id === activeSem)!;
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically import GSAP to avoid SSR mismatch if not already handling it, but we can just use normal gsap
    import("gsap").then((gsap) => {
      if (cardsRef.current) {
        gsap.default.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
        );
      }
    });
  }, [activeSem]);

  return (
    <section id="subjects" className="relative py-28 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="reveal-up text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Your <span className="gradient-text">Subjects</span>
          </h2>
          <p className="reveal-up mt-4 text-text-secondary text-lg max-w-xl mx-auto">
            Jump into any semester, explore subjects, and access week-by-week materials and notes.
          </p>
        </div>

        {/* Semester Switcher Bar */}
        <div className="reveal-up flex items-center justify-center gap-2 mb-14">
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
                {sem.status === "ongoing" && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                  </span>
                )}
                {sem.status === "upcoming" && (
                  <span className="ml-1.5 text-xs font-normal opacity-60">Soon</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Cards */}
        {currentSem.subjects.length > 0 ? (
          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {currentSem.subjects.map((subject) => (
              <div
                key={subject.code}
                className="glass-card rounded-2xl p-7 group hover:shadow-xl transition-all duration-400 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Subject icon & code */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{subject.icon}</span>
                      <span
                        className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-gradient-to-r ${subject.color} text-white`}
                      >
                        {subject.code}
                      </span>
                    </div>

                    {/* Subject name */}
                    <h3 className="text-lg font-bold text-text-primary leading-snug group-hover:text-brand-blue transition-colors duration-200">
                      {subject.name}
                    </h3>

                    {/* Metadata */}
                    <p className="text-sm text-text-muted mt-2">
                      {subject.weeks?.length || 0} weeks of content
                    </p>
                  </div>

                  {/* Action button */}
                  <Link
                    href={`/semester/${currentSem.id}/${subject.code.toLowerCase()}`}
                    className="flex-shrink-0 mt-2 flex items-center gap-1.5 text-sm font-semibold text-brand-blue opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                  >
                    <BookOpen className="w-4 h-4" />
                    Open
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card rounded-2xl">
            <p className="text-text-muted text-lg">
              🚧 Content for this semester is coming soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
