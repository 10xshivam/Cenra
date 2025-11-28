import { client } from "../../config/qdrant";

const EMBEDDING_DIM = 3072;

export const createCollection = async (workspaceId: string) => {
    try {
        await client.createCollection(workspaceId, {
      vectors: {
        size: EMBEDDING_DIM,
        distance: "Cosine",
      },
    });
    } catch (error) {
        console.error("Error creating collection:", error);
    }
}