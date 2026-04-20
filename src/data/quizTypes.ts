// Quiz system type definitions

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];       // 4 options (A, B, C, D)
  correctIndex: number;    // 0-3
  explanation: string;     // Why the answer is correct
}

export interface Quiz {
  subjectCode: string;
  subjectName: string;
  weekId: number;
  questions: QuizQuestion[];
  generatedAt: string;     // ISO timestamp
}

export interface QuizAttempt {
  quizId: string;          // "{subjectCode}-W{weekId}-{timestamp}"
  subjectCode: string;
  weekId: number;
  score: number;           // out of total questions
  totalQuestions: number;
  answers: number[];       // user's selected indices
  completedAt: string;     // ISO timestamp
}
