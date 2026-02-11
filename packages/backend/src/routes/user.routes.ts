import { Router } from "express";
import { getCurrentUser, googleLogin, loginUser, logoutUser, registerUser  } from "../controllers/user.controller";
import { verifyAuth } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/logout", verifyAuth, logoutUser);
router.get("/user", verifyAuth, getCurrentUser);

export default router;