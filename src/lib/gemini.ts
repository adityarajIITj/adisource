"use server";

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
});

export async function askGemini(
  prompt: string,
  lectureContent?: string,
  userApiKey?: string
): Promise<string> {
  try {
    const ai = userApiKey ? new GoogleGenAI({ apiKey: userApiKey }) : genAI;
    const systemContext = lectureContent
      ? `You are an AI tutor for the adisource learning platform. You are helping a student understand lecture content. Here is the lecture content for context:\n\n---\n${lectureContent.slice(0, 15000)}\n---\n\nAnswer the student's question based on this content. Be concise, clear, and helpful. Use bullet points and formatting where appropriate.`
      : `You are an AI tutor for the adisource learning platform. Help the student with their question. Be concise, clear, and helpful.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
