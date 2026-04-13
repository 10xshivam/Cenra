"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocument = void 0;
const path_1 = __importDefault(require("path"));
const pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
const csv_1 = require("@langchain/community/document_loaders/fs/csv");
const langchain_1 = require("langchain");
const fs_1 = __importDefault(require("fs"));
const getDocument = async (filePath) => {
    try {
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error("File does not exist");
        }
        const ext = path_1.default.extname(filePath).toLowerCase();
        let docs;
        if (ext === ".txt") {
            const fileContent = fs_1.default.readFileSync(filePath, "utf-8");
            docs = [
                new langchain_1.Document({
                    pageContent: fileContent,
                    metadata: {
                        source: filePath,
                    },
                }),
            ];
        }
        else if (ext === ".pdf") {
            const loader = new pdf_1.PDFLoader(filePath, {
                pdfjs: () => import("pdfjs-dist/legacy/build/pdf.mjs"),
            });
            docs = await loader.load();
        }
        else if (ext === ".csv") {
            const loader = new csv_1.CSVLoader(filePath);
            docs = await loader.load();
        }
        else {
            console.error("Unsupported file type");
            return null;
        }
        return docs;
    }
    catch (error) {
        console.error(`Failed to get document: ${error}`);
        return null;
    }
};
exports.getDocument = getDocument;
