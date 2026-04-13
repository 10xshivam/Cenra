"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const resource_controller_1 = require("../controllers/resource.controller");
const requireWorkspace_1 = require("../middlewares/requireWorkspace");
const requireSubscription_1 = require("../middlewares/requireSubscription");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = (0, multer_1.default)({ storage });
router.use("/:workspaceId/resources", auth_middleware_1.verifyAuth, requireWorkspace_1.requireWorkspaceAccess, requireSubscription_1.requireActiveSubscription);
// File Resource Routes
router.post("/:workspaceId/resources/file", upload.single("file"), resource_controller_1.createFileResource);
// Web Resource Routes
router.post("/:workspaceId/resources/web", resource_controller_1.createWebResource);
router.post("/:workspaceId/resources/:resourceId/recrawl", resource_controller_1.recrawlWebResource);
// Other Resource Routes
router.get("/:workspaceId/resources", resource_controller_1.getAllResources);
router.patch("/:workspaceId/resources/:resourceId/toggle", resource_controller_1.toggleResource);
router.delete("/:workspaceId/resources/:resourceId", resource_controller_1.deleteResource);
exports.default = router;
