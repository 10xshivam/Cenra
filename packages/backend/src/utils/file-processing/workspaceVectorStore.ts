import { QdrantVectorStore } from "@langchain/qdrant";
import { embedding } from "../../config/embedding";
import { client } from "../../config/qdrant";
import dotenv from "dotenv";

dotenv.config();

export const getWorkspaceVectorStore = async (workspaceId: string) => {
  try {
    if (!workspaceId) {
      console.error("Workspace ID is required");
      return null;
    }

    const collections = await client.getCollections();
    const exists = collections.collections.some(
      (collection) => collection.name === workspaceId
    );

    if (!exists) {
      await client.createCollection(workspaceId, {
        vectors: {
          size: 3072,
          distance: "Cosine",
        },
      });
    }

    return await QdrantVectorStore.fromExistingCollection(embedding, {
      client,
      collectionName: workspaceId,
    });
  } catch (error) {
    console.error(`Failed to get or create vector store: ${error}`);
    return null;
  }
};
