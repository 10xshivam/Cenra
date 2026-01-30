import { Router } from "express";
import { createCustomer, getCustomer } from "../controllers/customer.controller";

const route: Router = Router();

route.post("/:workspaceId/customers/create", createCustomer);
route.get("/:workspaceId/customers/:conversationId", getCustomer);

export default route;