import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { getWorkspaceVectorStore } from "../utils/file-processing/workspaceVectorStore";
import { prisma } from "@workspace/db";

export const vectorSearchTool = tool(
  async ({ query, workspaceId }: { query: string; workspaceId: string }) => {
    const vectorStore = await getWorkspaceVectorStore(workspaceId);
    if (!vectorStore) {
      return "Vector store not found for the specified workspace.";
    }

    const activeResources = await prisma.resource.findMany({
      where: { workspaceId, active: true },
      select: { id: true },
    });

    const activeIds = new Set(activeResources.map(r => r.id));

    const results = await vectorStore.similaritySearch(query, 6);

    const filtered = results.filter(
      d => d.metadata?.resourceId && activeIds.has(d.metadata.resourceId)
    );

    return filtered
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