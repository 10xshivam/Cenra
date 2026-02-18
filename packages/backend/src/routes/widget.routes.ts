import { Router } from "express";
import { identifyCustomer, initWidget } from "../controllers/widget.controller";
import { requireWorkspacePublic } from "../middlewares/requireWorkspace";

const route: Router = Router();

route.get("/init/:workspaceId", requireWorkspacePublic, initWidget);
route.post("/:workspaceId/identify", requireWorkspacePublic, identifyCustomer);

export default route;
