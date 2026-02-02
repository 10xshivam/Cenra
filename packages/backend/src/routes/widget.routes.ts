import { Router } from "express";
import { identifyCustomer, initWidget } from "../controllers/widget.controller";
import { requireWorkspaceAccess } from "../middlewares/requireWorkspace";

const route: Router = Router();

route.use(requireWorkspaceAccess);

route.get("/init/:workspaceId", initWidget);
route.post("/:workspaceId/identify", identifyCustomer);


export default route;