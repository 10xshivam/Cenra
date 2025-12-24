import { Request, Response } from "express";
import { getDocument } from "../utils/file-processing/getDocument";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getWorkspaceVectorStore } from "../utils/file-processing/workspaceVectorStore";
import { Document } from "langchain";
import { prisma } from "@workspace/db";
import fs from "fs";
import { client } from "../config/qdrant";

export const getAllResources = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const resources = await prisma.resource.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, resources });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const createResource = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId) {
      return res
        .status(400)
        .json({ success: false, message: "Workspace ID is required" });
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
        text,
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
