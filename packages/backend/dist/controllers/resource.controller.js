"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recrawlWebResource = exports.deleteResource = exports.toggleResource = exports.getAllResources = exports.createWebResource = exports.createFileResource = void 0;
const getDocument_1 = require("../utils/file-processing/getDocument");
const textsplitters_1 = require("@langchain/textsplitters");
const workspaceVectorStore_1 = require("../utils/file-processing/workspaceVectorStore");
const langchain_1 = require("langchain");
const db_1 = require("@workspace/db");
const fs_1 = __importDefault(require("fs"));
const qdrant_1 = require("../config/qdrant");
const crawlPage_1 = require("../utils/resources/crawlPage");
const plans_1 = require("../constants/plans");
const createFileResource = async (req, res) => {
    try {
        const workspace = req.workspace;
        const workspaceId = workspace.id;
        const plan = workspace.plan;
        const limits = plans_1.PLAN_FEATURES[plan];
        const docCount = await db_1.prisma.resource.count({
            where: { workspaceId, sourceType: "FILE" },
        });
        if (docCount >= limits.maxDocuments) {
            return res.status(403).json({
                success: false,
                message: "Document limit reached. Upgrade your plan.",
            });
        }
        const { file } = req;
        if (!file) {
            return res
                .status(400)
                .json({ success: false, message: "No file uploaded" });
        }
        const docs = await (0, getDocument_1.getDocument)(file.path);
        if (!docs || docs.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Failed to process the uploaded file",
            });
        }
        const text = docs.map((doc) => doc.pageContent).join("\n");
        const resource = await db_1.prisma.resource.create({
            data: {
                filename: file.originalname,
                workspaceId,
                mimeType: file.mimetype,
                fileText: text,
                sourceType: "FILE",
            },
        });
        const docsWithMeta = docs.map((doc) => new langchain_1.Document({
            pageContent: doc.pageContent,
            metadata: {
                ...doc.metadata,
                workspaceId,
                resourceId: resource.id,
            },
        }));
        const splitter = new textsplitters_1.RecursiveCharacterTextSplitter({
            chunkSize: 700,
            chunkOverlap: 200,
        });
        const splitDocs = await splitter.splitDocuments(docsWithMeta);
        const vectorStore = await (0, workspaceVectorStore_1.getWorkspaceVectorStore)(workspaceId);
        if (!vectorStore) {
            return res
                .status(500)
                .json({ success: false, message: "Failed to access vector store" });
        }
        await vectorStore.addDocuments(splitDocs);
        await fs_1.default.promises.unlink(file.path);
        return res.json({ success: true, resource });
    }
    catch (error) {
        await fs_1.default.promises.unlink(req.file.path);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
exports.createFileResource = createFileResource;
const createWebResource = async (req, res) => {
    try {
        const workspace = req.workspace;
        const { url, paths } = req.body;
        if (!url) {
            return res
                .status(400)
                .json({ success: false, message: "URL is required" });
        }
        const plan = workspace.plan;
        const limits = plans_1.PLAN_FEATURES[plan];
        const webResourceCount = await db_1.prisma.resource.count({
            where: { workspaceId: workspace.id, sourceType: "WEB" },
        });
        if (webResourceCount >= limits.maxWebResources) {
            return res.status(403).json({
                success: false,
                message: "Web resource limit reached. Upgrade your plan.",
            });
        }
        const normalizedPaths = Array.isArray(paths)
            ? paths.filter((p) => typeof p === "string" && p.trim().length > 0)
            : undefined;
        const crawled = await (0, crawlPage_1.crawlWebsitePages)(url, normalizedPaths);
        if (!crawled || crawled.length === 0) {
            return res
                .status(500)
                .json({ success: false, message: "Failed to crawl the webpage" });
        }
        const resource = await db_1.prisma.resource.create({
            data: {
                filename: url,
                workspaceId: workspace.id,
                url,
                webContent: crawled,
                sourceType: "WEB",
                paths: normalizedPaths,
            },
        });
        const docsWithMeta = crawled.map(({ page, content }) => {
            return new langchain_1.Document({
                pageContent: content,
                metadata: {
                    workspaceId: workspace.id,
                    resourceId: resource.id,
                    source: "web",
                    url,
                    pagePath: page,
                },
            });
        });
        const splitter = new textsplitters_1.RecursiveCharacterTextSplitter({
            chunkSize: 700,
            chunkOverlap: 200,
        });
        const splitDocs = await splitter.splitDocuments(docsWithMeta);
        const vectorStore = await (0, workspaceVectorStore_1.getWorkspaceVectorStore)(workspace.id);
        if (!vectorStore) {
            return res
                .status(500)
                .json({ success: false, message: "Failed to access vector store" });
        }
        await vectorStore.addDocuments(splitDocs);
        return res.json({
            success: true,
            message: "Web resource created successfully",
            pagesIndexed: crawled.length,
        });
    }
    catch (error) {
        console.error("createWebResource failed", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
exports.createWebResource = createWebResource;
const getAllResources = async (req, res) => {
    try {
        const workspace = req.workspace;
        const { sourceType } = req.query;
        if (sourceType && sourceType !== "FILE" && sourceType !== "WEB") {
            return res
                .status(400)
                .json({ success: false, message: "Invalid sourceType parameter" });
        }
        const resources = await db_1.prisma.resource.findMany({
            where: {
                workspaceId: workspace.id,
                sourceType: sourceType,
            },
            orderBy: { createdAt: "desc" },
        });
        return res.json({ success: true, resources });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
exports.getAllResources = getAllResources;
const toggleResource = async (req, res) => {
    try {
        const { resourceId } = req.params;
        const { active } = req.body;
        if (typeof active !== "boolean") {
            return res.status(400).json({ message: "Active flag required" });
        }
        const resource = await db_1.prisma.resource.update({
            where: { id: resourceId },
            data: { active },
        });
        return res.json({
            success: true,
            message: resource.active
                ? "Resource enabled for AI"
                : "Resource disabled for AI",
        });
    }
    catch (error) {
        console.error("toggleResource failed", error);
        return res.status(500).json({ message: "Failed to update resource" });
    }
};
exports.toggleResource = toggleResource;
const deleteResource = async (req, res) => {
    try {
        const { resourceId } = req.params;
        const resource = await db_1.prisma.resource.findUnique({
            where: { id: resourceId },
        });
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }
        await (0, qdrant_1.getQdrantClient)().delete(resource.workspaceId, {
            filter: {
                must: [
                    {
                        key: "metadata.resourceId",
                        match: {
                            value: resourceId,
                        },
                    },
                ],
            },
        });
        await db_1.prisma.resource.delete({
            where: { id: resourceId },
        });
        return res.json({
            success: true,
            message: "Resource deleted permanently",
        });
    }
    catch (error) {
        console.error("deleteResource failed", error);
        return res.status(500).json({ message: "Failed to delete resource" });
    }
};
exports.deleteResource = deleteResource;
const recrawlWebResource = async (req, res) => {
    try {
        const workspace = req.workspace;
        const { resourceId } = req.params;
        if (!resourceId) {
            return res
                .status(400)
                .json({
                success: false,
                message: "Resource ID is required",
            });
        }
        const resource = await db_1.prisma.resource.findFirst({
            where: { id: resourceId, workspaceId: workspace.id },
        });
        if (!resource) {
            return res
                .status(404)
                .json({ success: false, message: "Resource not found" });
        }
        const { url, paths } = resource;
        if (!url) {
            return res
                .status(400)
                .json({ success: false, message: "Resource has no URL config" });
        }
        const crawled = await (0, crawlPage_1.crawlWebsitePages)(url, paths);
        if (!crawled || crawled.length === 0) {
            return res
                .status(500)
                .json({ success: false, message: "Recrawl failed: no content" });
        }
        const docsWithMeta = crawled.map(({ page, content }) => ({
            pageContent: content,
            metadata: {
                workspaceId: workspace.id,
                resourceId,
                source: "web",
                url,
                pagePath: page,
            },
        }));
        const splitter = new textsplitters_1.RecursiveCharacterTextSplitter({
            chunkSize: 700,
            chunkOverlap: 200,
        });
        const splitDocs = await splitter.splitDocuments(docsWithMeta);
        const vectorStore = await (0, workspaceVectorStore_1.getWorkspaceVectorStore)(workspace.id);
        if (!vectorStore) {
            return res
                .status(500)
                .json({ success: false, message: "Failed to access vector store" });
        }
        await (0, qdrant_1.getQdrantClient)().delete(resource.workspaceId, {
            filter: {
                must: [
                    {
                        key: "metadata.resourceId",
                        match: {
                            value: resourceId,
                        },
                    },
                ],
            },
        });
        await vectorStore.addDocuments(splitDocs);
        await db_1.prisma.resource.update({
            where: { id: resourceId },
            data: { updatedAt: new Date() },
        });
        return res.json({
            success: true,
            message: "Recrawl completed",
        });
    }
    catch (error) {
        console.error("recrawlWebResource failed", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
exports.recrawlWebResource = recrawlWebResource;
