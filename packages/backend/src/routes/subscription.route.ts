import { Router } from "express";
import { createCheckoutSession, getSuscriptionDetails, syncSubscription } from "../controllers/susbcription.controller";
import { verifyAuth } from "../middlewares/auth.middleware";

const route:Router = Router();

route.use(verifyAuth);

route.post('/billing/create-checkout', createCheckoutSession);
route.post('/sync-subscription', syncSubscription);
route.get('/details', getSuscriptionDetails);

export default route;