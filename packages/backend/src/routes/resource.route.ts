import { Router } from "express";
import multer from "multer";
import {
  createFileResource,
  createWebResource,
  deleteResource,
  getAllResources,
  recrawlWebResource,
  toggleResource,
} from "../controllers/resource.controller";
import { requireWorkspaceAccess } from "../middlewares/requireWorkspace";
import { requireActiveSubscription } from "../middlewares/requireSubscription";
import { verifyAuth } from "../middlewares/auth.middleware";

const router: Router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.use(
  "/:workspaceId/resources",
  verifyAuth,
  requireWorkspaceAccess,
  requireActiveSubscription
);

// File Resource Routes
router.post("/:workspaceId/resources/file", upload.single("file"), createFileResource);

// Web Resource Routes
router.post("/:workspaceId/resources/web", createWebResource);
router.post("/:workspaceId/resources/:resourceId/recrawl", recrawlWebResource);

// Other Resource Routes
router.get("/:workspaceId/resources", getAllResources);
router.patch("/:workspaceId/resources/:resourceId/toggle", toggleResource);
router.delete("/:workspaceId/resources/:resourceId", deleteResource);

export default router;
