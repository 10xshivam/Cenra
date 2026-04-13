"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.realtime = void 0;
const realtime_1 = require("@upstash/realtime");
const redis_1 = require("@upstash/redis");
const zod_1 = require("zod");
// Create Redis instance
const redis = new redis_1.Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
// Define the same schema as the frontend
const schema = {
    message: {
        new: zod_1.z.object({
            conversationId: zod_1.z.string(),
            role: zod_1.z.enum(["user", "assistant"]),
            content: zod_1.z.string(),
            createdAt: zod_1.z.number().nullable().optional(),
        }),
        status: zod_1.z.object({
            conversationId: zod_1.z.string(),
            status: zod_1.z.enum(["active", "escalated", "resolved"]),
            needsIdentity: zod_1.z.boolean().optional(),
        }),
    },
};
exports.realtime = new realtime_1.Realtime({ schema, redis });
