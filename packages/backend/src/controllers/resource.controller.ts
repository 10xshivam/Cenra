import { Request, Response } from "express";
import { getDocument } from "../utils/file-processing/getDocument";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getWorkspaceVectorStore } from "../utils/file-processing/workspaceVectorStore";
import { Document } from "langchain";
import { prisma } from "@workspace/db";
import fs from "fs";

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

    // split + store in vector store
    const splitDocs = await splitter.splitDocuments(docsWithMeta);

    const vectorStore = await getWorkspaceVectorStore(workspaceId);
    if (!vectorStore) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to access vector store" });
    }

    await vectorStore.addDocuments(splitDocs);

    // delete file from disk AFTER success
    await fs.promises.unlink(file.path);

    return res.json({ success: true, resource });
  } catch (error) {
    await fs.promises.unlink(req.file!.path);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
