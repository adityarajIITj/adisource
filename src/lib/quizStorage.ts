// localStorage helpers for quiz scores

import type { QuizAttempt } from "@/data/quizTypes";

const QUIZ_ATTEMPTS_KEY = "adisource_quiz_attempts";

function getAllAttempts(): QuizAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUIZ_ATTEMPTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QuizAttempt[];
  } catch {
    return [];
  }
}

function saveAllAttempts(attempts: QuizAttempt[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUIZ_ATTEMPTS_KEY, JSON.stringify(attempts));
  } catch {
    // localStorage full or unavailable
  }
}

/** Save a new quiz attempt */
export function saveQuizAttempt(attempt: QuizAttempt) {
  const attempts = getAllAttempts();
  attempts.push(attempt);
  saveAllAttempts(attempts);
}

/** Get all attempts, optionally filtered */
export function getAttempts(subjectCode?: string, weekId?: number): QuizAttempt[] {
  let attempts = getAllAttempts();
  if (subjectCode) {
    attempts = attempts.filter(a => a.subjectCode === subjectCode);
  }
  if (weekId !== undefined) {
    attempts = attempts.filter(a => a.weekId === weekId);
  }
  return attempts;
}

/** Get the best score for a specific subject/week combo */
export function getBestScore(subjectCode: string, weekId: number): number | null {
  const attempts = getAttempts(subjectCode, weekId);
  if (attempts.length === 0) return null;
  return Math.max(...attempts.map(a => a.score));
}

/** Returns a map of "SUBJECTCODE-WEEKID" -> best score */
export function getAllBestScores(): Record<string, number> {
  const attempts = getAllAttempts();
  const best: Record<string, number> = {};
  for (const a of attempts) {
    const key = `${a.subjectCode}-${a.weekId}`;
    if (best[key] === undefined || a.score > best[key]) {
      best[key] = a.score;
    }
  }
  return best;
}

/** Check if a quiz has been completed for a given subject/week */
export function hasCompletedQuiz(subjectCode: string, weekId: number): boolean {
  return getAttempts(subjectCode, weekId).length > 0;
}

/** Get count of unique weeks with completed quizzes for a subject */
export function getCompletedQuizWeeksCount(subjectCode: string): number {
  const attempts = getAttempts(subjectCode);
  const uniqueWeeks = new Set(attempts.map(a => a.weekId));
  return uniqueWeeks.size;
}
