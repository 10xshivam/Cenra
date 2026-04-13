import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "dotenv";

dotenv.config();

let client: QdrantClient | null = null;

export function getQdrantClient() {
  const url = process.env.QDRANT_URL;
  const apiKey = process.env.QDRANT_API_KEY;

  if (!url) {
    throw new Error("QDRANT_URL is not set in environment");
  }

  if (!client) {
    client = new QdrantClient({
      url,
      apiKey,
    });
  }

  return client;
}
