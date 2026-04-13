"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.model = void 0;
const google_genai_1 = require("@langchain/google-genai");
const dotenv_1 = __importDefault(require("dotenv"));
const tools_1 = require("../ai/tools");
dotenv_1.default.config();
const llm = new google_genai_1.ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    temperature: 0,
});
exports.model = llm.bindTools([tools_1.vectorSearchTool]);
