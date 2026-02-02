import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { createWorkspace, getWorkspace } from "../controllers/workspace.controller";
import { requireActiveSubscription } from "../middlewares/requireSubscription";

const router: Router = Router();

router.use(verifyAuth, requireActiveSubscription);

router.post("/create", createWorkspace);
router.get("/get", getWorkspace);
    
export default router;