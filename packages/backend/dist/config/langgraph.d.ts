export declare function initLangGraph(): Promise<import("@langchain/langgraph").CompiledStateGraph<{
    messages: import("langchain").BaseMessage<import("@langchain/core/messages").MessageStructure, import("@langchain/core/messages").MessageType>[];
}, {
    messages?: import("@langchain/langgraph").Messages | undefined;
}, "toolNode" | "__start__" | "llmCall", {
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("langchain").BaseMessage<import("@langchain/core/messages").MessageStructure, import("@langchain/core/messages").MessageType>[], import("@langchain/langgraph").Messages>;
}, {
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("langchain").BaseMessage<import("@langchain/core/messages").MessageStructure, import("@langchain/core/messages").MessageType>[], import("@langchain/langgraph").Messages>;
}, import("@langchain/langgraph").StateDefinition, {
    llmCall: {
        messages: import("langchain").AIMessageChunk<import("@langchain/core/messages").MessageStructure>[];
    };
    toolNode: {
        messages: import("langchain").ToolMessage<import("@langchain/core/messages").MessageStructure>[];
    };
}, unknown, unknown>>;
export declare function getChatbot(): Promise<import("@langchain/langgraph").CompiledStateGraph<{
    messages: import("langchain").BaseMessage<import("@langchain/core/messages").MessageStructure, import("@langchain/core/messages").MessageType>[];
}, {
    messages?: import("@langchain/langgraph").Messages | undefined;
}, "toolNode" | "__start__" | "llmCall", {
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("langchain").BaseMessage<import("@langchain/core/messages").MessageStructure, import("@langchain/core/messages").MessageType>[], import("@langchain/langgraph").Messages>;
}, {
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("langchain").BaseMessage<import("@langchain/core/messages").MessageStructure, import("@langchain/core/messages").MessageType>[], import("@langchain/langgraph").Messages>;
}, import("@langchain/langgraph").StateDefinition, {
    llmCall: {
        messages: import("langchain").AIMessageChunk<import("@langchain/core/messages").MessageStructure>[];
    };
    toolNode: {
        messages: import("langchain").ToolMessage<import("@langchain/core/messages").MessageStructure>[];
    };
}, unknown, unknown>>;
//# sourceMappingURL=langgraph.d.ts.map