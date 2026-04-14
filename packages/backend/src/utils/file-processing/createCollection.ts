import { getQdrantClient } from "../../config/qdrant";
const EMBEDDING_DIM = 3072;

export const createCollection = async (workspaceId: string) => {
  try {
    const client = await getQdrantClient();
    await client.createCollection(workspaceId, {
      vectors: {
        size: EMBEDDING_DIM,
        distance: "Cosine",
      },
    });
    await client.createPayloadIndex(workspaceId, {
      field_name: "metadata.resourceId",
      field_schema: "uuid",
    });
    await client.createPayloadIndex(workspaceId, {
      field_name: "metadata.workspaceId",
      field_schema: "uuid",
    });
  } catch (error) {
    console.error("Error creating collection:", error);
  }
};
