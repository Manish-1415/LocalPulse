import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import isAdminMiddleware from "../../middlewares/isAdmin.middleware.js";
import { deleteUser, getPendingReport, getSingleUser, getUsers, pendingReports, reportResolution, updatePostStatus } from "./admin.controllers.js";

const router = Router();

// users

router.get("/get_users", authMiddleware, isAdminMiddleware, getUsers);

router.get("/get_user/user_id", authMiddleware, isAdminMiddleware, getSingleUser);

router.delete("delete_user/:user_id", authMiddleware, isAdminMiddleware, deleteUser);


// posts 

router.get("/get_posts", authMiddleware, isAdminMiddleware, getUsers);

router.patch("update_post_status/:post_id", authMiddleware, isAdminMiddleware, updatePostStatus);


// reports

router.get("/pending_reports", authMiddleware, isAdminMiddleware, pendingReports);

router.get("/pending_report/:report_id", authMiddleware, isAdminMiddleware, getPendingReport);

router.patch("/report_resolution/:report_id", authMiddleware, reportResolution);

export default router;