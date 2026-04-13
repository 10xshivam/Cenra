"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWidgetSettings = exports.createOrUpdateWidgetSettings = void 0;
const db_1 = require("@workspace/db");
const widgetSettings_1 = require("../utils/widget/widgetSettings");
const createOrUpdateWidgetSettings = async (req, res) => {
    try {
        const workspace = req.workspace;
        const body = req.body;
        const existing = await db_1.prisma.widgetSettings.findUnique({
            where: { workspaceId: workspace.id },
        });
        const data = {
            brandName: body.brandName ?? existing?.brandName ?? workspace.name,
            companyLogoUrl: body.companyLogoUrl !== undefined
                ? body.companyLogoUrl
                : (existing?.companyLogoUrl ?? null),
            greetMessage: body.greetMessage ?? existing?.greetMessage,
            themeMode: body.themeMode ?? existing?.themeMode,
            gradientFrom: body.gradientFrom ?? existing?.gradientFrom,
            themeColor: body.themeColor ?? existing?.themeColor,
            defaultSuggestions: (0, widgetSettings_1.normalizeSuggestions)(body.defaultSuggestions) ??
                existing?.defaultSuggestions ??
                undefined,
            whatsNewSection: (0, widgetSettings_1.mergeJson)(body.whatsNewSection, existing?.whatsNewSection),
            featuredArticlesSection: (0, widgetSettings_1.mergeJson)(body.featuredArticlesSection, existing?.featuredArticlesSection),
        };
        await db_1.prisma.widgetSettings.upsert({
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
    }
    catch (error) {
        console.error("Error saving widget settings:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createOrUpdateWidgetSettings = createOrUpdateWidgetSettings;
const getWidgetSettings = async (req, res) => {
    try {
        const workspace = req.workspace;
        let settings = await db_1.prisma.widgetSettings.findUnique({
            where: { workspaceId: workspace.id },
        });
        if (!settings) {
            settings = await db_1.prisma.widgetSettings.create({
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
    }
    catch (error) {
        console.error("Error retrieving widget settings:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getWidgetSettings = getWidgetSettings;
