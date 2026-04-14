"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendHumanMessage = void 0;
const messages_1 = require("@langchain/core/messages");
const langgraph_1 = require("@workspace/backend/config/langgraph");
const appendHumanMessage = async ({ conversation, content, }) => {
    const chatbot = (0, langgraph_1.getChatbot)();
    const config = {
        configurable: {
            thread_id: conversation.threadId,
            workspaceId: conversation.workspaceId,
            customerId: conversation.customerId,
        },
    };
    await chatbot.invoke({
        messages: [
            new messages_1.AIMessage({
                content,
                additional_kwargs: {
                    source: "human_agent",
                    timestamp: Date.now(),
                },
            }),
        ],
    }, config);
};
exports.appendHumanMessage = appendHumanMessage;
