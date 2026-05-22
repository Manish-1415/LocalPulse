import type { NextFunction, Request, Response } from "express";
import ApiError from "../utility/ApiError.js";
import Post from "../modules/post/post.model.js";

const updatePostStatusMiddleware = async (req : Request<{id : string}>, res : Response, next : NextFunction) => {
    const user = req.user;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if(!post) throw new ApiError(404, "Post Not Found");

    let isAdmin : boolean = user?.role === "admin" ? true : false;
    let isAuthor : boolean = user?._id === post.author.toString() ? true : false;

    if(!isAdmin && !isAuthor) throw new ApiError(403, "User is Unauthorized to Perform this Operation");

    req.post = post;

    next();
}


export default updatePostStatusMiddleware;