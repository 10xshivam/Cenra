import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { createWorkspace, getWorkspace } from "../controllers/workspace.controller";
import { requireActiveSubscription } from "../middlewares/requireSubscription";

const router: Router = Router();

router.post("/create", verifyAuth, requireActiveSubscription, createWorkspace);
router.get("/get", verifyAuth, requireActiveSubscription, getWorkspace);

export default router;
