"use client";

import { use } from "react";
import Link from "next/link";
import LearningEnvironment from "@/components/LearningEnvironment";
import { useCourseData } from "@/context/CourseDataContext";

export default function ViewMaterialPage(
  { params }: { params: Promise<{ semId: string; subjectCode: string; weekId: string; materialId: string }> }
) {
  const { semId: semIdStr, subjectCode, weekId: weekIdStr, materialId } = use(params);
  const semId = parseInt(semIdStr, 10);
  const weekId = parseInt(weekIdStr, 10);
  
  const { semesters, loading } = useCourseData();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-surface-primary">
        <div className="w-8 h-8 rounded-full border-4 border-brand-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  const semester = semesters.find(s => s.id === semId);
  const subject = semester?.subjects.find(s => s.code.toLowerCase() === subjectCode.toLowerCase());
  const week = subject?.weeks.find(w => w.id === weekId);

  if (!semester || !subject || !week) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Course Not Found</h2>
          <p className="text-text-secondary mb-6">We couldn't find this material.</p>
          <Link href="/#subjects" className="btn-primary">Return Home</Link>
        </div>
      </div>
    );
  }

  // Get all materials for this subject to drive the sidebar navigation
  const allMaterials = subject.weeks.reduce((acc, w) => [...acc, ...w.materials], [] as any[]);
  const material = allMaterials.find(m => m.id === materialId);

  if (!material) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Material Not Found</h2>
          <p className="text-text-secondary mb-6">This document could not be found.</p>
          <Link href={`/semester/${semId}/${subject.code.toLowerCase()}`} className="btn-primary">Return to Subject</Link>
        </div>
      </div>
    );
  }

  return (
    <LearningEnvironment 
      subject={subject}
      week={week}
      material={material}
      allMaterials={allMaterials}
      semId={semId}
    />
  );
}
