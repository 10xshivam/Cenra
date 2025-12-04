import { prisma } from "@workspace/db";
import { Request, Response } from "express";

const SESSION_DURATION_MS = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
const SESSION_EXTENSION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const initWidget = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const customerId = req.query.customerId as string | undefined;

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Invalid Workspace ID" });
    }

    const widgetSettings = await prisma.widgetSettings.findUnique({
      where: { workspaceId: workspace.id },
    });

    if (!widgetSettings) {
      return res.status(404).json({ message: "Widget settings not found" });
    }

    const workspaceDetails = {
      id: workspace.id,
      name: workspace.name,
      greetMessage: widgetSettings.greetMessage,
      defaultSuggestions: widgetSettings.defaultSuggestions,
    };

    if (!customerId) {
      return res.status(200).json({
        message: "Widget initialized successfully",
        workspace: workspaceDetails,
        session: {
          active: false,
          reason: "no_customer",
        },
      });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId, workspaceId: workspace.id },
    });

    if (!customer) {
      return res
        .status(404)
        .json({
          message: "Customer not found",
          workspace: workspaceDetails,
          session: { active: false, reason: "customer_not_found" },
        });
    }

    const now = new Date();
    const expired = !customer.expiresAt || customer.expiresAt < now;
    if (expired) {
      return res.status(200).json({
        message: "Session expired",
        workspace: workspaceDetails,
        session: { active: false, reason: "session_expired" },
      });
    }

    const newExpiry = Date.now() + SESSION_EXTENSION_MS;
    await prisma.customer.update({
      where: { id: customer.id },
      data: { expiresAt: new Date(newExpiry) },
    });

    return res.json({
      workspace: workspaceDetails,
      session: {
        active: true,
        customerId: customer.id,
      }
    });
  } catch (error) {
    console.error("Error initializing widget:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
