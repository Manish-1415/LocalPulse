import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { toggleVote } from "./vote.controller.js";

const router = Router();

router.post("/toggle_vote", authMiddleware, toggleVote);


export default router;