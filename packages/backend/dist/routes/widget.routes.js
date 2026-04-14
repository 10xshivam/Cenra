"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const widget_controller_1 = require("../controllers/widget.controller");
const requireWorkspace_1 = require("../middlewares/requireWorkspace");
const route = (0, express_1.Router)();
route.get("/init/:workspaceId", requireWorkspace_1.requireWorkspacePublic, widget_controller_1.initWidget);
route.post("/:workspaceId/identify", requireWorkspace_1.requireWorkspacePublic, widget_controller_1.identifyCustomer);
exports.default = route;
