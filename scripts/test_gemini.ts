import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: "AIzaSyCgtmTTbDnKPdbdjpx3Sj4a7ixTyOoktfc",
});

async function run() {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Hello world",
    });
    console.log("Success:", response.text);
  } catch (error: any) {
    console.log("ERROR MESSAGE:", error.message);
    console.log("ERROR DETAILS:", error);
  }
}

run();
