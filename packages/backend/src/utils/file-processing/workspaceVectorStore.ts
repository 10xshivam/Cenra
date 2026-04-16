import { QdrantVectorStore } from "@langchain/qdrant";
import { getEmbedding } from "../../config/embedding";
import { getQdrantClient } from "../../config/qdrant";
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

  const vectorStore = await QdrantVectorStore.fromExistingCollection(getEmbedding(), {
    client: await getQdrantClient(),
    collectionName: workspaceId,
  });

  storeCache.set(workspaceId, vectorStore);
  return vectorStore;
};
