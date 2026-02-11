import { Router } from "express";
import { createCustomer, getCustomer } from "../controllers/customer.controller";
import { requireWorkspaceAccess } from "../middlewares/requireWorkspace";

const route: Router = Router();

route.use("/:workspaceId/customers", requireWorkspaceAccess);

route.post("/:workspaceId/customers/create", createCustomer);
route.get("/:workspaceId/customers/:conversationId", getCustomer);

export default route;