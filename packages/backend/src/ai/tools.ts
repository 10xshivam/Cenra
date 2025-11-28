import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { getWorkspaceVectorStore } from "../utils/file-processing/workspaceVectorStore";

export const vectorSearchTool = tool(
  async ({ query, workspaceId }: { query: string; workspaceId: string }) => {
    const vectorStore = await getWorkspaceVectorStore(workspaceId);
    if (!vectorStore) {
      return "Vector store not found for the specified workspace.";
    }
    const results = await vectorStore.similaritySearch(query, 3);
    return results
      .map((doc, idx) => `Result ${idx + 1}:\n${doc.pageContent}`)
      .join("\n\n");
  },
  {
    name: "vector_search",
    description: "Search company knowledge base for relevant information",
    schema: z.object({
      query: z.string().describe("Search query text"),
      workspaceId: z.string().describe("Workspace identifier"),
    }),
  }
);

export const toolsByName = { [vectorSearchTool.name]: vectorSearchTool };