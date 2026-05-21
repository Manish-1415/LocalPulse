import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { createComment, deleteComment, getComments } from "./comment.controllers.js";

const router = Router({mergeParams : true});

router.post("/create_comment", authMiddleware, createComment);

router.get("/get_comments", getComments);

router.delete("/delete_comment/:comment_id", authMiddleware, deleteComment);

export default router;