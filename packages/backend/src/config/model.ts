import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
import { vectorSearchTool } from "../ai/tools";

dotenv.config();

let modelInstance: ReturnType<ChatGoogleGenerativeAI["bindTools"]> | null = null;

export function getModel() {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not set in environment");
  }

  if (!modelInstance) {
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash-lite",
      temperature: 0,
    });

    modelInstance = llm.bindTools([vectorSearchTool]);
  }

  return modelInstance;
}

