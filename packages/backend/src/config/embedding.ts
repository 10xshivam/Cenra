import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

let embedding: GoogleGenerativeAIEmbeddings | null = null;

export function getEmbedding() {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not set in environment");
  }

  if (!embedding) {
    embedding = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001",
    });
  }

  return embedding;
}
