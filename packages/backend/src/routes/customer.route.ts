import { Router } from "express";
import { createCustomer, getCustomer } from "../controllers/customer.controller";
import { requireWorkspaceAccess } from "../middlewares/requireWorkspace";
import { verifyAuth } from "../middlewares/auth.middleware";

const route: Router = Router();

route.use("/:workspaceId/customers", verifyAuth, requireWorkspaceAccess);

route.post("/:workspaceId/customers/create", createCustomer);
route.get("/:workspaceId/customers/:conversationId", getCustomer);

export default route;
