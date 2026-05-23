import { Router } from "express";
import { createUser, getUser, newAccessToken, updatePassword, updateUser, userLogin, userLogOut } from "./user.controllers.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validateRefToken } from "../../middlewares/verifyRefToken.middleware.js";
import isGuest from "../../middlewares/isGuest.middleware.js";

const router = Router();

router.post("/register", isGuest, createUser);

router.post("/login", isGuest, userLogin);

router.post("/logout", authMiddleware, userLogOut);

router.get("/get_profile/:id", authMiddleware ,getUser);

router.patch("/update_profile/:id", authMiddleware, updateUser);

router.patch("/update_password/:id", authMiddleware, updatePassword);

router.post("/generate_token", validateRefToken, newAccessToken);

export default router;