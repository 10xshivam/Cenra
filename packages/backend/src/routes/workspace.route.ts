import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { createWorkspace, getWorkspace } from "../controllers/workspace.controller";

const router: Router = Router();

router.post("/create",verifyAuth,createWorkspace);
router.get("/get", verifyAuth, getWorkspace);

export default router;