import { BaseMessage, ToolMessage } from "@langchain/core/messages";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
export type GraphState = typeof MessagesAnnotation.State;
export declare const agent: StateGraph<{
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<BaseMessage<import("@langchain/core/messages").MessageStructure, import("@langchain/core/messages").MessageType>[], import("@langchain/langgraph").Messages>;
}, import("@langchain/langgraph").StateType<{
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<BaseMessage<import("@langchain/core/messages").MessageStructure, import("@langchain/core/messages").MessageType>[], import("@langchain/langgraph").Messages>;
}>, import("@langchain/langgraph").UpdateType<{
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<BaseMessage<import("@langchain/core/messages").MessageStructure, import("@langchain/core/messages").MessageType>[], import("@langchain/langgraph").Messages>;
}>, "toolNode" | "__start__" | "llmCall", {
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<BaseMessage<import("@langchain/core/messages").MessageStructure, import("@langchain/core/messages").MessageType>[], import("@langchain/langgraph").Messages>;
}, {
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<BaseMessage<import("@langchain/core/messages").MessageStructure, import("@langchain/core/messages").MessageType>[], import("@langchain/langgraph").Messages>;
}, import("@langchain/langgraph").StateDefinition, {
    llmCall: {
        messages: import("@langchain/core/messages").AIMessageChunk<import("@langchain/core/messages").MessageStructure>[];
    };
    toolNode: {
        messages: ToolMessage<import("@langchain/core/messages").MessageStructure>[];
    };
}, unknown, unknown>;
//# sourceMappingURL=agent.d.ts.map