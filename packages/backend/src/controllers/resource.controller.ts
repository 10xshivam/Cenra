import { Request, Response } from "express";
import { getDocument } from "../utils/file-processing/getDocument";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getWorkspaceVectorStore } from "../utils/file-processing/workspaceVectorStore";
import { Document } from "langchain";
import { prisma } from "@workspace/db";
import fs from "fs";
import { client } from "../config/qdrant";
import { crawlWebsitePages } from "../utils/resources/crawlPage";

export const createFileResource = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId) {
      return res
        .status(400)
        .json({ success: false, message: "Workspace ID is required" });
    }

    const { file } = req;

    console.log("Uploaded file:", file);

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
        })
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
    const { workspaceId } = req.params;
    const { url, paths } = req.body as {
      url: string;
      paths?: string[];
    };

    if (!workspaceId || !url) {
      return res
        .status(400)
        .json({ success: false, message: "Workspace ID and URL are required" });
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
        workspaceId,
        url,
        webContent: crawled,
        sourceType: "WEB",
        paths: normalizedPaths
      },
    });

    const docsWithMeta: Document[] = crawled.map(({ page, content }) => {
      return new Document({
        pageContent: content,
        metadata: {
          workspaceId,
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

    const vectorStore = await getWorkspaceVectorStore(workspaceId);
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
    const { workspaceId } = req.params;
    const { sourceType } = req.query;

    if (sourceType && sourceType !== "FILE" && sourceType !== "WEB") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid sourceType parameter" });
    }
    
    if (!workspaceId) {
      return res
        .status(400)
        .json({ success: false, message: "Workspace ID is required" });
    }
    const resources = await prisma.resource.findMany({
      where: { workspaceId, sourceType: sourceType as "FILE" | "WEB" | undefined },
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
    const { workspaceId, resourceId } = req.params;

    if (!workspaceId || !resourceId) {
      return res
        .status(400)
        .json({ success: false, message: "Workspace ID and Resource ID are required" });
    }

    const resource = await prisma.resource.findFirst({
      where: { id: resourceId, workspaceId },
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
        workspaceId,
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

    const vectorStore = await getWorkspaceVectorStore(workspaceId);
    if (!vectorStore) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to access vector store" });
    }

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





