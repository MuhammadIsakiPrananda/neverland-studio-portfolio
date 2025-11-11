import {
  GoogleGenerativeAI,
  type Content,
} from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY is not set in .env.local");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are a friendly and professional AI assistant for Neverland Studio, a creative digital agency.

Your role is to answer user questions about Neverland Studio's services, pricing, and contact information.

Keep your answers concise, helpful, and always maintain a positive and professional tone.
Do not answer questions that are not related to Neverland Studio. If a user asks an unrelated question, politely steer the conversation back to Neverland Studio's business.

Neverland Studio's services include: Web Development, UI/UX Design, and Digital Consultation.`,
});

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

export async function runChat(history: Content[], newMessage: string) {
    const chat = model.startChat({ history, generationConfig });
    const result = await chat.sendMessage(newMessage);
    return result.response.text();
}