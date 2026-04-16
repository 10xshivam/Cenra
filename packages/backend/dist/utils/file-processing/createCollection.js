"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollection = void 0;
const qdrant_1 = require("../../config/qdrant");
const EMBEDDING_DIM = 3072;
const createCollection = async (workspaceId) => {
    try {
        const client = await (0, qdrant_1.getQdrantClient)();
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
    }
    catch (error) {
        console.error("Error creating collection:", error);
    }
};
exports.createCollection = createCollection;
