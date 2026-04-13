"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedding = void 0;
const google_genai_1 = require("@langchain/google-genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.embedding = new google_genai_1.GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001"
});
