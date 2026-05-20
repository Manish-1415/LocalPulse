import Router from "express"
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import updatePostStatusMiddleware from "../../middlewares/updatePostStatus.middleware.js";
import { createPost, deletePost, fetchPosts, fetchResolvedPost, getPost, updatePost, updatePostStatus } from "./post.controllers.js";

const router = Router();

router.post("/create_post", authMiddleware, createPost);

router.get("/get_post/:id", getPost);

router.patch("/update_post/:id", authMiddleware, updatePost);

router.patch("/update_post_status/:id", authMiddleware, updatePostStatusMiddleware, updatePostStatus);

router.get("/fetch_posts", fetchPosts);

router.delete("/delete_post/:id", authMiddleware, deletePost);

router.get("/resolved_posts", fetchResolvedPost);

export default router;