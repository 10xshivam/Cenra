import * as z from "zod";
export declare const vectorSearchTool: import("@langchain/core/tools").DynamicStructuredTool<z.ZodObject<{
    query: z.ZodString;
    workspaceId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    query: string;
    workspaceId: string;
}, {
    query: string;
    workspaceId: string;
}>, {
    query: string;
    workspaceId: string;
}, {
    query: string;
    workspaceId: string;
}, string>;
export declare const escalateConversationTool: import("@langchain/core/tools").DynamicStructuredTool<z.ZodObject<{
    conversationId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    conversationId: string;
}, {
    conversationId: string;
}>, {
    conversationId: string;
}, {
    conversationId: string;
}, string>;
export declare const resolveConversationTool: import("@langchain/core/tools").DynamicStructuredTool<z.ZodObject<{
    conversationId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    conversationId: string;
}, {
    conversationId: string;
}>, {
    conversationId: string;
}, {
    conversationId: string;
}, string>;
export declare const toolsByName: {
    vector_search: import("@langchain/core/tools").DynamicStructuredTool<z.ZodObject<{
        query: z.ZodString;
        workspaceId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        query: string;
        workspaceId: string;
    }, {
        query: string;
        workspaceId: string;
    }>, {
        query: string;
        workspaceId: string;
    }, {
        query: string;
        workspaceId: string;
    }, string>;
    escalate_conversation: import("@langchain/core/tools").DynamicStructuredTool<z.ZodObject<{
        conversationId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        conversationId: string;
    }, {
        conversationId: string;
    }>, {
        conversationId: string;
    }, {
        conversationId: string;
    }, string>;
    resolve_conversation: import("@langchain/core/tools").DynamicStructuredTool<z.ZodObject<{
        conversationId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        conversationId: string;
    }, {
        conversationId: string;
    }>, {
        conversationId: string;
    }, {
        conversationId: string;
    }, string>;
};
//# sourceMappingURL=tools.d.ts.map