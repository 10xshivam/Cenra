import { Request, Response } from "express";
import { prisma } from "@workspace/db";
import { mergeJson, normalizeSuggestions } from "../utils/widget/widgetSettings";

export const createOrUpdateWidgetSettings = async (req: Request, res: Response) => {
  try {
    const workspace = req.workspace!;
    const body = req.body;

    const existing = await prisma.widgetSettings.findUnique({
      where: { workspaceId: workspace.id },
    });

    const data = {
      brandName: body.brandName ?? existing?.brandName ?? workspace.name,
      companyLogoUrl:
        body.companyLogoUrl !== undefined
          ? body.companyLogoUrl
          : (existing?.companyLogoUrl ?? null),
      greetMessage: body.greetMessage ?? existing?.greetMessage,
      themeMode: body.themeMode ?? existing?.themeMode,
      gradientFrom: body.gradientFrom ?? existing?.gradientFrom,
      themeColor: body.themeColor ?? existing?.themeColor,

      defaultSuggestions: normalizeSuggestions(body.defaultSuggestions) ??
        existing?.defaultSuggestions ??
        undefined,

      whatsNewSection: mergeJson(body.whatsNewSection, existing?.whatsNewSection),
      featuredArticlesSection: mergeJson(
        body.featuredArticlesSection,
        existing?.featuredArticlesSection
      ),
    };

    await prisma.widgetSettings.upsert({
      where: { workspaceId: workspace.id },
      update: data,
      create: {
        workspaceId: workspace.id,
        ...data,
      },
    });

    return res.status(200).json({
      message: "Widget settings saved successfully",
    });
  } catch (error) {
    console.error("Error saving widget settings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getWidgetSettings = async (req: Request, res: Response) => {
  try {
    const workspace = req.workspace!;

    let settings = await prisma.widgetSettings.findUnique({
      where: { workspaceId: workspace.id },
    });

    if (!settings) {
      settings = await prisma.widgetSettings.create({
        data: { workspaceId: workspace.id },
      });
    }

    return res.status(200).json({
      message: "Widget settings retrieved successfully",
      widgetSettings: {
        brandName: settings.brandName ?? workspace.name,
        companyLogoUrl: settings.companyLogoUrl,
        greetMessage: settings.greetMessage,
        themeMode: settings.themeMode,
        gradientFrom: settings.gradientFrom,
        themeColor: settings.themeColor,
        defaultSuggestions: settings.defaultSuggestions,
        whatsNewSection: settings.whatsNewSection,
        featuredArticlesSection: settings.featuredArticlesSection,
      },
    });
  } catch (error) {
    console.error("Error retrieving widget settings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
