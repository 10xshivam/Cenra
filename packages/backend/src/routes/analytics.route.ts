import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { getAnalytics } from "../controllers/analytics.controller";
import { requireWorkspaceAccess } from "../middlewares/requireWorkspace";

const router: Router = Router();

router.get("/:workspaceId/analytics", verifyAuth, requireWorkspaceAccess, getAnalytics);

export default router;
