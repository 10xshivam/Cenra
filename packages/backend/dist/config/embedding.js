"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmbedding = getEmbedding;
const google_genai_1 = require("@langchain/google-genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let embedding = null;
function getEmbedding() {
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error("GOOGLE_API_KEY is not set in environment");
    }
    if (!embedding) {
        embedding = new google_genai_1.GoogleGenerativeAIEmbeddings({
            model: "gemini-embedding-001",
        });
    }
    return embedding;
}
