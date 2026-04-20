"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCourseData } from "@/context/CourseDataContext";
import { useAuth } from "@/hooks/useAuth";
import { generateQuiz } from "@/lib/gemini";
import { saveQuizAttempt, getBestScore } from "@/lib/quizStorage";
import type { QuizQuestion, QuizAttempt } from "@/data/quizTypes";
import {
  ArrowLeft, Sparkles, Key, Loader2, CheckCircle2, XCircle,
  ChevronRight, Trophy, RotateCcw, Home, ExternalLink, Clock, Zap, Target, Settings
} from "lucide-react";

type QuizPhase = "pre" | "loading" | "active" | "results";

export default function QuizSessionPage({ params }: { params: Promise<{ subjectCode: string; weekId: string }> }) {
  const { subjectCode, weekId: weekIdStr } = use(params);
  const weekId = parseInt(weekIdStr, 10);
  const { semesters, loading: dataLoading } = useCourseData();
  const { user } = useAuth();

  const [phase, setPhase] = useState<QuizPhase>("pre");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userApiKey, setUserApiKey] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [timeLimit, setTimeLimit] = useState<number>(0); // 0 = no limit, else seconds
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const questionRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Find subject and week data
  let subject = null;
  let week = null;
  let semId = 0;
  for (const sem of semesters) {
    const s = sem.subjects.find(sub => sub.code.toLowerCase() === subjectCode.toLowerCase());
    if (s) {
      subject = s;
      semId = sem.id;
      week = s.weeks.find(w => w.id === weekId);
      break;
    }
  }

  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setUserApiKey(savedKey);
      setHasApiKey(true);
    }
    if (subject) {
      const best = getBestScore(subject.code, weekId);
      setBestScore(best);
    }
  }, [subject, weekId]);

  // Timer logic
  useEffect(() => {
    if (phase === "active" && timeLimit > 0 && !showExplanation) {
      if (timeLeft > 0) {
        timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      } else {
        // Time's up!
        setShowExplanation(true);
        setSelectedAnswer(-1); // Mark as none selected
        setAnswers(prev => [...prev, -1]);
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, timeLeft, timeLimit, showExplanation]);

  useEffect(() => {
    if (phase === "active" && !showExplanation) {
      setTimeLeft(timeLimit);
    }
  }, [currentQ, phase, showExplanation, timeLimit]);

  // Fetch lecture content and generate quiz
  const handleGenerateQuiz = async () => {
    if (!subject || !week) return;
    setPhase("loading");
    setError(null);

    try {
      // Fetch all lecture HTML content for this week
      const contentParts: string[] = [];
      for (const material of week.materials) {
        try {
          const response = await fetch(`/materials/${material.fileName}`);
          if (response.ok) {
            const html = await response.text();
            // Extract text from HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const text = doc.body?.innerText || "";
            contentParts.push(text.slice(0, 8000));
          }
        } catch {
          // Skip failed fetches
        }
      }

      const lectureContent = contentParts.join("\n\n---\n\n");

      if (lectureContent.trim().length < 100) {
        setError("Could not load enough lecture content. Please try again.");
        setPhase("pre");
        return;
      }

      const result = await generateQuiz(subject.name, weekId, lectureContent, userApiKey, difficulty);

      if (result.error || !result.questions) {
        setError(result.error || "Failed to generate quiz.");
        setPhase("pre");
        return;
      }

      setQuestions(result.questions);
      setCurrentQ(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setPhase("active");
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setPhase("pre");
    }
  };

  // Handle answer selection
  const handleSelectAnswer = (optionIndex: number) => {
    if (showExplanation) return; // Already answered
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);
    setAnswers(prev => [...prev, optionIndex]);
  };

  // Move to next question or finish
  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      questionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Calculate score and save
      const finalAnswers = [...answers];
      let score = 0;
      questions.forEach((q, idx) => {
        if (finalAnswers[idx] === q.correctIndex) score++;
      });

      const attempt: QuizAttempt = {
        quizId: `${subject!.code}-W${weekId}-${Date.now()}`,
        subjectCode: subject!.code,
        weekId,
        score,
        totalQuestions: questions.length,
        answers: finalAnswers,
        completedAt: new Date().toISOString(),
      };
      saveQuizAttempt(attempt);
      setBestScore(prev => prev !== null ? Math.max(prev, score) : score);
      setPhase("results");
    }
  };

  // Retake
  const handleRetake = () => {
    setPhase("pre");
    setQuestions([]);
    setCurrentQ(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setError(null);
  };

  const saveApiKey = (key: string) => {
    localStorage.setItem("gemini_api_key", key);
    setUserApiKey(key);
    setHasApiKey(true);
  };

  // Calculate score for results
  const score = questions.reduce((acc, q, idx) => acc + (answers[idx] === q.correctIndex ? 1 : 0), 0);
  const scorePercent = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const passed = scorePercent >= 70;

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary">
        <div className="w-8 h-8 rounded-full border-4 border-brand-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!subject || !week) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Quiz Not Found</h2>
          <p className="text-text-secondary mb-6">Could not find this subject or week.</p>
          <Link href="/quiz" className="btn-primary"><span>Back to Quizzes</span></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col pt-24 bg-surface-primary">
      <Navbar />

      <main className="flex-grow px-6 pb-24">
        <div className="mx-auto max-w-3xl">

          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-text-muted flex-wrap">
            <Link href="/quiz" className="hover:text-brand-blue flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Quizzes
            </Link>
            <span>/</span>
            <span>{subject.code}</span>
            <span>/</span>
            <span>Week {weekId}</span>
          </div>

          {/* =================== PRE-QUIZ =================== */}
          {phase === "pre" && (
            <div className="quiz-card-enter">
              <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${subject.color} opacity-20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none`} />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{subject.icon}</span>
                    <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-gradient-to-r ${subject.color} text-white`}>
                      {subject.code}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-primary mb-2">
                    {subject.name}
                  </h1>
                  <p className="text-text-secondary text-lg mb-2">Week {weekId} Quiz</p>
                  <p className="text-text-muted text-sm mb-8">
                    {week.materials.length} lecture{week.materials.length !== 1 ? "s" : ""} · 10 MCQ questions · AI-generated
                  </p>

                  {bestScore !== null && (
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium">
                      <Trophy className="w-4 h-4" />
                      Best Score: {bestScore}/10
                    </div>
                  )}

                  {/* Settings Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Difficulty */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Difficulty</p>
                      <div className="flex bg-surface-secondary p-1 rounded-xl border border-gray-200 dark:border-white/5">
                        {["Easy", "Medium", "Hard"].map((d) => (
                          <button
                            key={d}
                            onClick={() => setDifficulty(d as any)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                              difficulty === d 
                                ? "bg-white dark:bg-gray-800 text-brand-purple shadow-sm" 
                                : "text-text-muted hover:text-text-secondary"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Timer */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Time Limit</p>
                      <div className="flex bg-surface-secondary p-1 rounded-xl border border-gray-200 dark:border-white/5">
                        {[
                          { label: "Off", val: 0 },
                          { label: "30s", val: 30 },
                          { label: "60s", val: 60 }
                        ].map((t) => (
                          <button
                            key={t.val}
                            onClick={() => setTimeLimit(t.val)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                              timeLimit === t.val
                                ? "bg-white dark:bg-gray-800 text-brand-blue shadow-sm" 
                                : "text-text-muted hover:text-text-secondary"
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                      ⚠️ {error}
                    </div>
                  )}

                  {!hasApiKey ? (
                    /* AI Not Ready Card - Redirect to Settings */
                    <div className="p-8 rounded-3xl bg-surface-secondary border border-purple-200 dark:border-purple-800 relative overflow-hidden text-center">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500" />
                      <div className="flex justify-center mb-6">
                        <div className="p-4 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-2xl text-white shadow-xl shadow-purple-500/20">
                          <Settings className="w-8 h-8" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-text-primary mb-2">AI Setup Required</h3>
                      <p className="text-text-secondary mb-8 max-w-sm mx-auto">
                        Your Gemini API key is missing. Please add it to your platform settings once to enable all AI features.
                      </p>
                      <Link 
                        href="/settings" 
                        className="btn-primary inline-flex items-center gap-2 !px-8"
                      >
                        <Zap className="w-4 h-4" />
                        Go to Settings
                      </Link>
                    </div>
                  ) : (
                    /* Generate Button */
                    <button onClick={handleGenerateQuiz} className="btn-primary text-lg !py-4 !px-8 glow-pulse">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Generate Quiz
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}


          {/* =================== LOADING =================== */}
          {phase === "loading" && (
            <div className="glass-card rounded-3xl p-12 md:p-16 text-center quiz-card-enter">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-brand-purple to-brand-magenta mb-6 shadow-xl shadow-purple-500/30">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-3">Generating Your Quiz</h2>
              <p className="text-text-secondary max-w-md mx-auto mb-8">
                Reading lecture content and crafting questions...
              </p>
              <div className="max-w-xs mx-auto space-y-3">
                {["Reading lecture files...", "Analyzing content...", "Generating questions..."].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-text-muted animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                    <div className="w-2 h-2 rounded-full bg-brand-purple" />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================== ACTIVE QUIZ =================== */}
          {phase === "active" && questions[currentQ] && (
            <div ref={questionRef}>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-semibold text-text-primary">
                    Question {currentQ + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-4">
                    {timeLimit > 0 && (
                      <div className={`flex items-center gap-1.5 font-bold ${timeLeft < 10 ? "text-red-500 animate-pulse" : "text-text-primary"}`}>
                        <Clock className="w-4 h-4" />
                        {timeLeft}s
                      </div>
                    )}
                    <span className="text-text-muted">
                      {answers.filter((a, i) => a === questions[i]?.correctIndex).length} correct
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full quiz-progress-bar transition-all duration-500"
                    style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <div className="glass-card rounded-3xl p-8 md:p-10 quiz-card-enter" key={currentQ}>
                <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-8 leading-relaxed">
                  {questions[currentQ].question}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {questions[currentQ].options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === questions[currentQ].correctIndex;
                    const isRevealed = showExplanation;

                    let optionStyle = "border-gray-200 dark:border-white/10 bg-surface-secondary hover:border-brand-purple/40 hover:bg-purple-500/5 cursor-pointer";

                    if (isRevealed) {
                      if (isCorrect) {
                        optionStyle = "border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950/30 quiz-correct-pulse";
                      } else if (isSelected && !isCorrect) {
                        optionStyle = "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/30 quiz-incorrect-shake";
                      } else {
                        optionStyle = "border-gray-200 dark:border-white/5 bg-surface-secondary opacity-50 cursor-default";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectAnswer(idx)}
                        disabled={showExplanation}
                        className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 ${optionStyle}`}
                      >
                        <div className="flex items-start gap-4">
                          <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                            isRevealed && isCorrect
                              ? "bg-green-500 text-white"
                              : isRevealed && isSelected && !isCorrect
                              ? "bg-red-500 text-white"
                              : "bg-gray-200 dark:bg-gray-800 text-text-secondary"
                          }`}>
                            {isRevealed && isCorrect ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : isRevealed && isSelected && !isCorrect ? (
                              <XCircle className="w-5 h-5" />
                            ) : (
                              String.fromCharCode(65 + idx)
                            )}
                          </span>
                          <span className="text-text-primary font-medium text-sm md:text-base leading-relaxed">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showExplanation && (
                  <div className="mt-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 quiz-card-enter">
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">💡 Explanation</p>
                    <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                      {questions[currentQ].explanation}
                    </p>
                  </div>
                )}

                {/* Next Button */}
                {showExplanation && (
                  <button
                    onClick={handleNext}
                    className="mt-6 btn-primary w-full !py-4 quiz-card-enter"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {currentQ < questions.length - 1 ? (
                        <>Next Question <ChevronRight className="w-5 h-5" /></>
                      ) : (
                        <>See Results <Trophy className="w-5 h-5" /></>
                      )}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* =================== RESULTS =================== */}
          {phase === "results" && (
            <div className="quiz-card-enter">
              {/* Score Card */}
              <div className={`glass-card rounded-3xl p-10 md:p-14 text-center relative overflow-hidden ${
                passed ? "border-green-300 dark:border-green-800" : "border-orange-300 dark:border-orange-800"
              }`}>
                <div className={`absolute inset-0 ${
                  passed 
                    ? "bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5" 
                    : "bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5"
                }`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 shadow-xl ${
                    passed
                      ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/30"
                      : "bg-gradient-to-br from-orange-400 to-red-500 shadow-orange-500/30"
                  }`}>
                    {passed ? (
                      <Trophy className="w-12 h-12 text-white" />
                    ) : (
                      <RotateCcw className="w-12 h-12 text-white" />
                    )}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-2">
                    {passed ? "Great Job! 🎉" : "Keep Practicing! 💪"}
                  </h2>
                  <p className="text-text-secondary mb-8">
                    {passed
                      ? "You've demonstrated a solid understanding of this week's material."
                      : "Review the lecture content and try again to improve your score."}
                  </p>

                  {/* Score Display */}
                  <div className="flex items-center justify-center gap-8 mb-10">
                    <div className="text-center">
                      <div className="text-5xl font-extrabold text-text-primary quiz-score-countup">{score}</div>
                      <div className="text-sm text-text-muted mt-1">Correct</div>
                    </div>
                    <div className="w-px h-16 bg-gray-200 dark:bg-gray-700" />
                    <div className="text-center">
                      <div className="text-5xl font-extrabold text-text-muted">{questions.length}</div>
                      <div className="text-sm text-text-muted mt-1">Total</div>
                    </div>
                    <div className="w-px h-16 bg-gray-200 dark:bg-gray-700" />
                    <div className="text-center">
                      <div className={`text-5xl font-extrabold ${passed ? "text-green-500" : "text-orange-500"}`}>{scorePercent}%</div>
                      <div className="text-sm text-text-muted mt-1">Score</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={handleRetake} className="btn-primary !py-3 !px-6">
                      <span className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Retake Quiz
                      </span>
                    </button>
                    <Link href="/quiz" className="btn-secondary !py-3 !px-6 flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Back to Quizzes
                    </Link>
                  </div>
                </div>
              </div>

              {/* Per-Question Review */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-text-primary mb-4">Question Review</h3>
                <div className="space-y-3">
                  {questions.map((q, idx) => {
                    const userAnswer = answers[idx];
                    const isCorrect = userAnswer === q.correctIndex;
                    return (
                      <div key={idx} className={`p-4 rounded-xl border ${
                        isCorrect
                          ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20"
                          : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
                      }`}>
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary mb-1">{q.question}</p>
                            {!isCorrect && (
                              <p className="text-xs text-text-muted">
                                Your answer: {q.options[userAnswer]} · Correct: {q.options[q.correctIndex]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
