import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { createReport, deleteReport, getReports } from "./report.controllers.js";

const router = Router();

router.post("create_report",authMiddleware, createReport);

router.delete("delete_report", authMiddleware, deleteReport);

router.get("/get_reports", authMiddleware, getReports);

export default router;