import { Request, Response } from "express";
import { prisma } from "@workspace/db";

export const createOrUpdateWidgetSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const { workspaceId } = req.params;
    const { greetMessage, defaultSuggestions } = req.body;

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }

    const existingSettings = await prisma.widgetSettings.findUnique({
      where: { workspaceId },
    });

    let widgetSettings;

    if (existingSettings) {
      widgetSettings = await prisma.widgetSettings.update({
        where: { workspaceId },
        data: {
          greetMessage: greetMessage ?? existingSettings.greetMessage,
          defaultSuggestions: {
            suggestion1: defaultSuggestions?.suggestion1 ?? null,
            suggestion2: defaultSuggestions?.suggestion2 ?? null,
            suggestion3: defaultSuggestions?.suggestion3 ?? null,
          },
        },
      });
    } else {
      widgetSettings = await prisma.widgetSettings.create({
        data: {
          workspaceId,
          greetMessage: greetMessage ?? null,
          defaultSuggestions: {
            suggestion1: defaultSuggestions?.suggestion1 ?? null,
            suggestion2: defaultSuggestions?.suggestion2 ?? null,
            suggestion3: defaultSuggestions?.suggestion3 ?? null,
          },
        },
      });
    }

    const { id, workspaceId: widgetWorkspaceId, ...rest } = widgetSettings;
    return res.status(200).json({
      message: "Widget settings saved successfully",
      widgetSettings: rest,
    });
  } catch (error) {
    console.error("Error saving widget settings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getWidgetSettings = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const widgetSettings = await prisma.widgetSettings.findUnique({
      where: { workspaceId: workspace.id },
    });
    
    if (!widgetSettings) {
      return res.status(404).json({ message: "Widget settings not found" });
    }

    return res.status(200).json({
      message: "Widget settings retrieved successfully",
      widgetSettings: {
        name: workspace.name,
        website: workspace.website,
        greetMessage: widgetSettings.greetMessage,
        defaultSuggestions: widgetSettings.defaultSuggestions,
      },
    });
  } catch (error) {
    console.error("Error retrieving widget settings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
