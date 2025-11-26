import { prisma } from "@workspace/db";
import { Response } from "express";

export const setWorkspaceCookie = async (userId: string, res: Response) => {
  try {
    const workspace = await prisma.workspace.findFirst({
      where: { userId },
    });

    const hasWorkspace = !!workspace;

    res.cookie("hasWorkspace", String(hasWorkspace), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return hasWorkspace;
  } catch (error) {
    console.error("Error setting workspace cookie:", error);
    return false;
  }
};
