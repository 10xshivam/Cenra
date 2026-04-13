"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspaceVectorStore = void 0;
const qdrant_1 = require("@langchain/qdrant");
const embedding_1 = require("../../config/embedding");
const qdrant_2 = require("../../config/qdrant");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const storeCache = new Map();
const getWorkspaceVectorStore = async (workspaceId) => {
    if (!workspaceId) {
        throw new Error("workspaceId is required");
    }
    if (storeCache.has(workspaceId)) {
        return storeCache.get(workspaceId);
    }
    const vectorStore = await qdrant_1.QdrantVectorStore.fromExistingCollection((0, embedding_1.getEmbedding)(), {
        client: (0, qdrant_2.getQdrantClient)(),
        collectionName: workspaceId,
    });
    storeCache.set(workspaceId, vectorStore);
    return vectorStore;
};
exports.getWorkspaceVectorStore = getWorkspaceVectorStore;
