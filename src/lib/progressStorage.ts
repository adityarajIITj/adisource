// localStorage helpers for semester/subject progress tracking

import { getCompletedQuizWeeksCount } from "@/lib/quizStorage";
import type { Subject } from "@/data/courses";

const VIEWED_MATERIALS_KEY = "adisource_viewed_materials";

interface ViewedMaterialsMap {
  [materialKey: string]: boolean; // key = "SUBJECTCODE-WEEKID-MATERIALID"
}

function getViewedMap(): ViewedMaterialsMap {
  try {
    const raw = localStorage.getItem(VIEWED_MATERIALS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ViewedMaterialsMap;
  } catch {
    return {};
  }
}

function saveViewedMap(map: ViewedMaterialsMap) {
  try {
    localStorage.setItem(VIEWED_MATERIALS_KEY, JSON.stringify(map));
  } catch {
    // localStorage full or unavailable
  }
}

/** Mark a material as viewed */
export function markMaterialViewed(subjectCode: string, weekId: number, materialId: string) {
  const map = getViewedMap();
  const key = `${subjectCode}-${weekId}-${materialId}`;
  map[key] = true;
  saveViewedMap(map);
}

/** Check if a material has been viewed */
export function isMaterialViewed(subjectCode: string, weekId: number, materialId: string): boolean {
  const map = getViewedMap();
  const key = `${subjectCode}-${weekId}-${materialId}`;
  return !!map[key];
}

/** Get total number of viewed materials for a subject */
export function getViewedMaterialsCount(subjectCode: string): number {
  const map = getViewedMap();
  let count = 0;
  for (const key of Object.keys(map)) {
    if (key.startsWith(`${subjectCode}-`)) {
      count++;
    }
  }
  return count;
}

/**
 * Calculate progress percentage for a subject.
 * Progress = (materials viewed + quiz weeks completed) / (total materials + total weeks) * 100
 */
export function getSubjectProgress(
  subjectCode: string,
  totalMaterials: number,
  totalWeeks: number
): number {
  const viewedCount = getViewedMaterialsCount(subjectCode);
  const quizWeeksCompleted = getCompletedQuizWeeksCount(subjectCode);

  const totalActivities = totalMaterials + totalWeeks;
  if (totalActivities === 0) return 0;

  const completedActivities = Math.min(viewedCount, totalMaterials) + Math.min(quizWeeksCompleted, totalWeeks);
  return Math.round((completedActivities / totalActivities) * 100);
}

/**
 * Get overall semester progress.
 * - "completed" semesters always return 100
 * - "ongoing"/"upcoming" semesters calculate average of subject progress
 */
export function getSemesterProgress(
  semesterStatus: "completed" | "ongoing" | "upcoming",
  subjects: Subject[]
): number {
  if (semesterStatus === "completed") return 100;
  if (subjects.length === 0) return 0;

  let totalProgress = 0;
  for (const subject of subjects) {
    const totalMaterials = subject.weeks.reduce((sum, w) => sum + w.materials.length, 0);
    const totalWeeks = subject.weeks.length;
    totalProgress += getSubjectProgress(subject.code, totalMaterials, totalWeeks);
  }

  return Math.round(totalProgress / subjects.length);
}
