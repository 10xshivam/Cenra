"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQdrantClient = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
let clientPromise = null;
const getQdrantClient = async () => {
    if (!clientPromise) {
        clientPromise = import("@qdrant/js-client-rest").then(({ QdrantClient }) => new QdrantClient({
            url: QDRANT_URL,
            apiKey: QDRANT_API_KEY,
        }));
    }
    return clientPromise;
};
exports.getQdrantClient = getQdrantClient;
