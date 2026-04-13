"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolsByName = exports.resolveConversationTool = exports.escalateConversationTool = exports.vectorSearchTool = void 0;
const tools_1 = require("@langchain/core/tools");
const z = __importStar(require("zod"));
const workspaceVectorStore_1 = require("../utils/file-processing/workspaceVectorStore");
const db_1 = require("@workspace/db");
exports.vectorSearchTool = (0, tools_1.tool)(async ({ query, workspaceId }) => {
    const vectorStore = await (0, workspaceVectorStore_1.getWorkspaceVectorStore)(workspaceId);
    if (!vectorStore) {
        return "Vector store not found for the specified workspace.";
    }
    const activeResources = await db_1.prisma.resource.findMany({
        where: { workspaceId, active: true },
        select: { id: true },
    });
    const activeIds = new Set(activeResources.map(r => r.id));
    const results = await vectorStore.similaritySearch(query, 6);
    const filtered = results.filter(d => d.metadata?.resourceId && activeIds.has(d.metadata.resourceId));
    return filtered
        .map((doc, idx) => `Result ${idx + 1}:\n${doc.pageContent}`)
        .join("\n\n");
}, {
    name: "vector_search",
    description: "Search company knowledge base for relevant information",
    schema: z.object({
        query: z.string().describe("Search query text"),
        workspaceId: z.string().describe("Workspace identifier"),
    }),
});
exports.escalateConversationTool = (0, tools_1.tool)(async ({ conversationId }) => {
    await db_1.prisma.conversation.update({
        where: { id: conversationId },
        data: { status: "escalated" },
    });
    return "Conversation has been escalated to a human agent.";
}, {
    name: "escalate_conversation",
    description: "Escalate the conversation to a human agent when the user asks for human help or is unhappy.",
    schema: z.object({
        conversationId: z.string(),
    }),
});
exports.resolveConversationTool = (0, tools_1.tool)(async ({ conversationId }) => {
    await db_1.prisma.conversation.update({
        where: { id: conversationId },
        data: { status: "resolved" },
    });
    return "Conversation has been marked as resolved.";
}, {
    name: "resolve_conversation",
    description: "Mark the conversation as resolved when the user confirms their issue is solved.",
    schema: z.object({
        conversationId: z.string(),
    }),
});
exports.toolsByName = {
    vector_search: exports.vectorSearchTool,
    escalate_conversation: exports.escalateConversationTool,
    resolve_conversation: exports.resolveConversationTool,
};
