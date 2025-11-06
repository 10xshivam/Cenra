import { prisma } from "@workspace/db";
import { Request, Response } from "express";

export const createWorkspace = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    const { name, website } = req.body;

    if (!name || !website) {
      return res
        .status(400)
        .json({ message: "Company name and Website are required" });
    }

    const newWorkspace = await prisma.workspace.create({
      data: {
        name,
        website,
        user: {
          connect: { id: userId },
        },
      },
    });

    if (newWorkspace) {
      return res.status(201).json({
        message: "Workspace created successfully",
        workspace: {
          id: newWorkspace.id,
          name: newWorkspace.name,
          website: newWorkspace.website,
        },
      });
    } else {
      return res.status(400).json({ message: "Failed to create workspace" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getWorkspace = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    const workspaces = await prisma.workspace.findFirst({
      where: { userId },
    });

    console.log("Workspaces:", workspaces);

    if(workspaces){
        return res.status(200).json({
            message: "Workspace fetched successfully",
            workspace: {
                id: workspaces.id,
                name: workspaces.name,
                website: workspaces.website,
            }
        });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
