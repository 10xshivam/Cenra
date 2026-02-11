import { Router } from "express";
import { identifyCustomer, initWidget } from "../controllers/widget.controller";
import { requireWorkspaceAccess } from "../middlewares/requireWorkspace";

const route: Router = Router();


route.get("/init/:workspaceId", requireWorkspaceAccess, initWidget);
route.post("/:workspaceId/identify",requireWorkspaceAccess, identifyCustomer);


export default route;