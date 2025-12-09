import { Router } from "express";
import { identifyCustomer, initWidget } from "../controllers/widget.controller";

const route: Router = Router();

route.get("/init/:workspaceId", initWidget);
route.post("/:workspaceId/identify", identifyCustomer);


export default route;