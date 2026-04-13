"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const js_client_rest_1 = require("@qdrant/js-client-rest");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
exports.client = new js_client_rest_1.QdrantClient({
    url: QDRANT_URL,
    apiKey: QDRANT_API_KEY,
});
