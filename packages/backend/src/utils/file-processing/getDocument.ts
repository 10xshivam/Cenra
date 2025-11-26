import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { Document } from "langchain";
import fs from "fs";

export const getDocument = async (
  filePath: string
) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File does not exist");
    }

    const ext = path.extname(filePath).toLowerCase();

    let docs: Document[];

    if (ext === ".txt") {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      docs = [
        new Document({
          pageContent: fileContent,
          metadata: {
            source: filePath,
          },
        }),
      ];
    } else if (ext === ".pdf") {
      const loader = new PDFLoader(filePath, {
        pdfjs: () => import("pdfjs-dist/legacy/build/pdf.mjs"),
      });
      docs = await loader.load();
    } else if (ext === ".csv") {
      const loader = new CSVLoader(filePath);
      docs = await loader.load();
    } else {
      console.error("Unsupported file type");
      return null;
    }

    return docs;
  } catch (error) {
    console.error(`Failed to get document: ${error}`);
    return null;
  }
};

