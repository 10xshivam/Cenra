"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const analytics_controller_1 = require("../controllers/analytics.controller");
const requireWorkspace_1 = require("../middlewares/requireWorkspace");
const router = (0, express_1.Router)();
router.get("/:workspaceId/analytics", auth_middleware_1.verifyAuth, requireWorkspace_1.requireWorkspaceAccess, analytics_controller_1.getAnalytics);
exports.default = router;
