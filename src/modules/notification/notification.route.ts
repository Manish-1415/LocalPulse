import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getNotifications, readNotifications } from "./notification.controllers.js";

const router = Router();

router.get("/get_notifications", authMiddleware, getNotifications);

router.delete("/delete_notifications", authMiddleware, readNotifications);

export default router;