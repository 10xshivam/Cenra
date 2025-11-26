import { Router } from "express";
import multer from "multer";
import { createResource } from "../controllers/resource.controller";

const router: Router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post("/:workspaceId/resources/file", upload.single("file"),createResource);

export default router;