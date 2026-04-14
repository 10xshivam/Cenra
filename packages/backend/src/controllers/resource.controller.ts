import { Request, Response } from "express";
import { getDocument } from "../utils/file-processing/getDocument";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getWorkspaceVectorStore } from "../utils/file-processing/workspaceVectorStore";
import { Document } from "langchain";
import { prisma } from "@workspace/db";
import fs from "fs";
import { getQdrantClient } from "../config/qdrant";
import { crawlWebsitePages } from "../utils/resources/crawlPage";
import { PLAN_FEATURES } from "../constants/plans";

export const createFileResource = async (req: Request, res: Response) => {
  try {
    const workspace = req.workspace!;
    const workspaceId = workspace.id;

    const plan = workspace.plan as keyof typeof PLAN_FEATURES;
    const limits = PLAN_FEATURES[plan]; 

    const docCount = await prisma.resource.count({
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

    const docs = await getDocument(file.path);

    if (!docs || docs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Failed to process the uploaded file",
      });
    }

    const text = docs.map((doc) => doc.pageContent).join("\n");

    const resource = await prisma.resource.create({
      data: {
        filename: file.originalname,
        workspaceId,
        mimeType: file.mimetype,
        fileText: text,
        sourceType: "FILE",
      },
    });

    const docsWithMeta = docs.map(
      (doc) =>
        new Document({
          pageContent: doc.pageContent,
          metadata: {
            ...doc.metadata,
            workspaceId,
            resourceId: resource.id,
          },
        }),
    );

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 700,
      chunkOverlap: 200,
    });

    const splitDocs = await splitter.splitDocuments(docsWithMeta);

    const vectorStore = await getWorkspaceVectorStore(workspaceId);
    if (!vectorStore) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to access vector store" });
    }

    await vectorStore.addDocuments(splitDocs);

    await fs.promises.unlink(file.path);

    return res.json({ success: true, resource });
  } catch (error) {
    await fs.promises.unlink(req.file!.path);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const createWebResource = async (req: Request, res: Response) => {
  try {
    const workspace = req.workspace!;
    const { url, paths } = req.body as {
      url: string;
      paths?: string[];
    };

    if (!url) {
      return res
        .status(400)
        .json({ success: false, message: "URL is required" });
    }

    const plan = workspace.plan as keyof typeof PLAN_FEATURES;
    const limits = PLAN_FEATURES[plan];

    const webResourceCount = await prisma.resource.count({
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

    const crawled = await crawlWebsitePages(url, normalizedPaths);
    if (!crawled || crawled.length === 0) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to crawl the webpage" });
    }

    const resource = await prisma.resource.create({
      data: {
        filename: url,
        workspaceId: workspace.id,
        url,
        webContent: crawled,
        sourceType: "WEB",
        paths: normalizedPaths,
      },
    });

    const docsWithMeta: Document[] = crawled.map(({ page, content }) => {
      return new Document({
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

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 700,
      chunkOverlap: 200,
    });

    const splitDocs = await splitter.splitDocuments(docsWithMeta);

    const vectorStore = await getWorkspaceVectorStore(workspace.id);
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
  } catch (error) {
    console.error("createWebResource failed", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAllResources = async (req: Request, res: Response) => {
  try {
    const workspace = req.workspace!;
    const { sourceType } = req.query;

    if (sourceType && sourceType !== "FILE" && sourceType !== "WEB") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid sourceType parameter" });
    }

    const resources = await prisma.resource.findMany({
      where: {
        workspaceId: workspace.id,
        sourceType: sourceType as "FILE" | "WEB" | undefined,
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, resources });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const toggleResource = async (req: Request, res: Response) => {
  try {
    const { resourceId } = req.params;
    const { active } = req.body;

    if (typeof active !== "boolean") {
      return res.status(400).json({ message: "Active flag required" });
    }

    const resource = await prisma.resource.update({
      where: { id: resourceId },
      data: { active },
    });

    return res.json({
      success: true,
      message: resource.active
        ? "Resource enabled for AI"
        : "Resource disabled for AI",
    });
  } catch (error) {
    console.error("toggleResource failed", error);
    return res.status(500).json({ message: "Failed to update resource" });
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  try {
    const { resourceId } = req.params;

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const client = await getQdrantClient();
    await client.delete(resource.workspaceId, {
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

    await prisma.resource.delete({
      where: { id: resourceId },
    });

    return res.json({
      success: true,
      message: "Resource deleted permanently",
    });
  } catch (error) {
    console.error("deleteResource failed", error);
    return res.status(500).json({ message: "Failed to delete resource" });
  }
};

export const recrawlWebResource = async (req: Request, res: Response) => {
  try {
    const workspace = req.workspace!;
    const { resourceId } = req.params;

    if (!resourceId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Resource ID is required",
        });
    }

    const resource = await prisma.resource.findFirst({
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

    const crawled = await crawlWebsitePages(url, paths);
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

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 700,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments(docsWithMeta);

    const vectorStore = await getWorkspaceVectorStore(workspace.id);
    if (!vectorStore) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to access vector store" });
    }

    const client = await getQdrantClient();
    await client.delete(resource.workspaceId, {
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

    await prisma.resource.update({
      where: { id: resourceId },
      data: { updatedAt: new Date() },
    });

    return res.json({
      success: true,
      message: "Recrawl completed",
    });
  } catch (error) {
    console.error("recrawlWebResource failed", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
