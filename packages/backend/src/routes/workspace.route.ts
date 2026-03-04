import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { createWorkspace, getWorkspace, updateWorkspace } from "../controllers/workspace.controller";
import { requireActiveSubscription } from "../middlewares/requireSubscription";

const router: Router = Router();

router.post("/create", verifyAuth, requireActiveSubscription, createWorkspace);
router.get("/get", verifyAuth, requireActiveSubscription, getWorkspace);
router.patch("/update", verifyAuth, requireActiveSubscription, updateWorkspace);

export default router;
