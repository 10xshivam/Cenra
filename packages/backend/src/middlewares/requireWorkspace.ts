import { prisma } from "@workspace/db";
import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      workspace?: {
        id: string;
        userId: string;
        name: string;
        website: string | null;
        plan: string;
      };
    }
  }
}

export const requireWorkspaceAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { workspaceId } = req.params;

  if (!workspaceId) {
    return res.status(400).json({ message: "Workspace ID required" });
  }

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized: No token provided." });
  }

  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      userId: req.userId,
    },
  });

  if (!workspace) {
    return res.status(403).json({ message: "No access to workspace" });
  }

  req.workspace = workspace;
  next();
};

export const requireWorkspacePublic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { workspaceId } = req.params;

  if (!workspaceId) {
    return res.status(400).json({ message: "Workspace ID required" });
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    return res.status(404).json({ message: "Workspace not found" });
  }

  req.workspace = workspace;
  next();
};
