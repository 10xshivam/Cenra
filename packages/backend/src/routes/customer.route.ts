import { Router } from "express";
import { createCustomer } from "../controllers/customer.controller";

const route: Router = Router();

route.post("/:workspaceId/customers/create", createCustomer);

export default route;