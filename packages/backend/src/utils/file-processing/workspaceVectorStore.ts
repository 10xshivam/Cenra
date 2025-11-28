import { QdrantVectorStore } from "@langchain/qdrant";
import { embedding } from "../../config/embedding";
import { client } from "../../config/qdrant";
import dotenv from "dotenv";

dotenv.config();

const storeCache = new Map<string, QdrantVectorStore>();

export const getWorkspaceVectorStore = async (workspaceId: string) => {
  if (!workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (storeCache.has(workspaceId)) {
    return storeCache.get(workspaceId)!;
  }

  const vectorStore = await QdrantVectorStore.fromExistingCollection(embedding, {
    client,
    collectionName: workspaceId,
  });

  storeCache.set(workspaceId, vectorStore);
  return vectorStore;
};
