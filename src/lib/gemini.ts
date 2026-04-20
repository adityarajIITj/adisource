"use server";

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
  apiVersion: "v1",
});

export async function askGemini(
  prompt: string,
  lectureContent?: string,
  userApiKey?: string
): Promise<string> {
  try {
    const ai = userApiKey ? new GoogleGenAI({ apiKey: userApiKey, apiVersion: "v1" }) : genAI;
    const systemContext = lectureContent
      ? `You are an AI tutor for the adisource learning platform. You are helping a student understand lecture content. Here is the lecture content for context:\n\n---\n${lectureContent.slice(0, 15000)}\n---\n\nAnswer the student's question based on this content. Be concise, clear, and helpful. Use bullet points and formatting where appropriate.`
      : `You are an AI tutor for the adisource learning platform. Help the student with their question. Be concise, clear, and helpful.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemContext}\n\nStudent's question: ${prompt}` }],
        },
      ],
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return `⚠️ API Error: ${error?.message || error || "Unknown error"}`;
  }
}

export interface GeneratedQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/**
 * Generate a quiz from lecture content using the USER's Gemini API key.
 * No shared/public key fallback — user must provide their own key.
 */
export async function generateQuiz(
  subjectName: string,
  weekId: number,
  lectureContent: string,
  userApiKey: string,
  difficulty: "Easy" | "Medium" | "Hard" = "Medium"
): Promise<{ questions: GeneratedQuizQuestion[] | null; error: string | null }> {
  if (!userApiKey || !userApiKey.trim()) {
    return { questions: null, error: "API key is required. Please add your Gemini API key in settings." };
  }

  if (!lectureContent || lectureContent.trim().length < 100) {
    return { questions: null, error: "Not enough lecture content to generate a quiz." };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: userApiKey, apiVersion: "v1" });

    const prompt = `You are a quiz generator for a university course. Based ONLY on the following lecture content, generate exactly 10 multiple-choice questions.

SUBJECT: ${subjectName}
WEEK: ${weekId}
DIFFICULTY: ${difficulty}

LECTURE CONTENT:
---
${lectureContent.slice(0, 20000)}
---

INSTRUCTIONS:
- Generate exactly 10 questions based strictly on the lecture content above
- Each question must have exactly 4 options
- Questions should test understanding, not just memorization
- Difficulty focus: ${
  difficulty === "Easy" ? "7 easy, 3 medium" : 
  difficulty === "Hard" ? "3 medium, 7 hard" : 
  "3 easy, 4 medium, 3 hard"
}
- Provide a brief explanation for why the correct answer is right

Return your response as a JSON array with this exact structure (no markdown, no code fences, just raw JSON):
[
  {
    "id": 1,
    "question": "What is...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "This is correct because..."
  }
]

IMPORTANT: Return ONLY the JSON array, nothing else. No markdown formatting, no code blocks, no extra text.`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = response.text || "";
    
    // Try to extract JSON from the response
    let jsonStr = text.trim();
    
    // Remove markdown code fences if present
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    
    // Find the JSON array
    const startIdx = jsonStr.indexOf("[");
    const endIdx = jsonStr.lastIndexOf("]");
    if (startIdx !== -1 && endIdx !== -1) {
      jsonStr = jsonStr.slice(startIdx, endIdx + 1);
    }

    const questions: GeneratedQuizQuestion[] = JSON.parse(jsonStr);

    // Validate structure
    if (!Array.isArray(questions) || questions.length === 0) {
      return { questions: null, error: "Invalid quiz format received. Please try again." };
    }

    // Normalize and validate each question
    const validated = questions.slice(0, 10).map((q, idx) => ({
      id: idx + 1,
      question: String(q.question || ""),
      options: Array.isArray(q.options) ? q.options.map(String).slice(0, 4) : [],
      correctIndex: typeof q.correctIndex === "number" ? Math.min(Math.max(q.correctIndex, 0), 3) : 0,
      explanation: String(q.explanation || ""),
    }));

    // Ensure each question has exactly 4 options
    const valid = validated.filter(q => q.options.length === 4 && q.question.length > 0);
    if (valid.length < 5) {
      return { questions: null, error: "Could not generate enough valid questions. Please try again." };
    }

    return { questions: valid, error: null };
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    if (error?.message?.includes("API_KEY")) {
      return { questions: null, error: "Invalid API key. Please check your Gemini API key and try again." };
    }
    return { questions: null, error: `Failed to generate quiz: ${error?.message || "Unknown error"}` };
  }
}
