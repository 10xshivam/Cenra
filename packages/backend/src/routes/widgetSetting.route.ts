import { Router } from "express";
import {
  createOrUpdateWidgetSettings,
  getWidgetSettings,
} from "../controllers/widgetSetting.controller";
import { requireWorkspaceAccess } from "../middlewares/requireWorkspace";
import { verifyAuth } from "../middlewares/auth.middleware";

const route: Router = Router();

route.use("/:workspaceId/widget-setting", verifyAuth, requireWorkspaceAccess);

route.post("/:workspaceId/widget-setting", createOrUpdateWidgetSettings);
route.get("/:workspaceId/widget-setting", getWidgetSettings);

export default route;
