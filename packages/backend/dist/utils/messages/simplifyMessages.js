"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplifyMessage = void 0;
const crypto_1 = require("crypto");
const simplifyMessage = (msg) => {
    const type = msg._getType?.();
    const id = (0, crypto_1.randomUUID)();
    if (type === "human") {
        return {
            id,
            from: "user",
            content: msg.content
        };
    }
    if (type === "ai") {
        const content = msg.content;
        if (typeof content === "string") {
            return {
                id,
                from: "assistant",
                content
            };
        }
        if (Array.isArray(content)) {
            const hasOnlyFunctionCall = content.length &&
                content.every((c) => c.type === "functionCall" || c.type === "tool");
            if (hasOnlyFunctionCall)
                return null;
            const textParts = content
                .filter((c) => c.type === "text")
                .map((c) => c.text);
            if (textParts.length) {
                return {
                    id,
                    from: "assistant",
                    content: textParts.join("\n")
                };
            }
            return null;
        }
    }
    return null;
};
exports.simplifyMessage = simplifyMessage;
