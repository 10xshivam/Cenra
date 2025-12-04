import { Router } from "express";
import { initWidget } from "../controllers/widget.controller";

const route: Router = Router();

route.get("/init/:workspaceId", initWidget);


export default route;