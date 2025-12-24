import { Router } from "express";
import multer from "multer";
import { createResource, deleteResource, toggleResource } from "../controllers/resource.controller";

const router: Router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post("/:workspaceId/resources/file", upload.single("file"),createResource);
router.patch("/:workspaceId/resources/:resourceId/toggle", toggleResource);
router.delete("/:workspaceId/resources/:resourceId", deleteResource);

export default router;