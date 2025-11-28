import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
import { vectorSearchTool } from "../ai/tools";

dotenv.config();

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  temperature: 0,
});

export const model = llm.bindTools([vectorSearchTool])

