"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQdrantClient = getQdrantClient;
const js_client_rest_1 = require("@qdrant/js-client-rest");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let client = null;
function getQdrantClient() {
    const url = process.env.QDRANT_URL;
    const apiKey = process.env.QDRANT_API_KEY;
    if (!url) {
        throw new Error("QDRANT_URL is not set in environment");
    }
    if (!client) {
        client = new js_client_rest_1.QdrantClient({
            url,
            apiKey,
        });
    }
    return client;
}
