import type { QdrantClient } from "@qdrant/js-client-rest" with {
  "resolution-mode": "import"
};
import dotenv from "dotenv";

dotenv.config();

const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

let clientPromise: Promise<QdrantClient> | null = null;

export const getQdrantClient = async (): Promise<QdrantClient> => {
  if (!clientPromise) {
    clientPromise = import("@qdrant/js-client-rest").then(
      ({ QdrantClient }) =>
        new QdrantClient({
          url: QDRANT_URL,
          apiKey: QDRANT_API_KEY,
        }),
    );
  }

  return clientPromise;
};
