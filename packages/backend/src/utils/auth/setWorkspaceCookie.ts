import { prisma } from "@workspace/db";
import { Response } from "express";
import { getAuthCookieOptions } from "./cookieOptions";

export const setWorkspaceCookie = async (userId: string, res: Response) => {
  try {
    const workspace = await prisma.workspace.findFirst({
      where: { userId },
    });

    const hasWorkspace = !!workspace;

    res.cookie("hasWorkspace", String(hasWorkspace), {
      ...getAuthCookieOptions(),
    });

    return hasWorkspace;
  } catch (error) {
    console.error("Error setting workspace cookie:", error);
    return false;
  }
};
