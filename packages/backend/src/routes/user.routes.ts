import { Router } from "express";
import { getCurrentUser, googleAuthCallback, loginUser, logoutUser, registerUser  } from "../controllers/user.controller";
import { verifyAuth } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/google/callback", googleAuthCallback);
router.post("/logout", logoutUser);
router.get("/me", verifyAuth, getCurrentUser);

export default router;