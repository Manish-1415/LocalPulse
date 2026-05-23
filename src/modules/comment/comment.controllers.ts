import type { Request, Response } from "express";
import { createCommentSchema } from "./comment.validation.js";
import commentService from "./comment.services.js";
import ApiResponse from "../../utility/ApiResponse.js";


export const createComment = async (req : Request<{post_id : string}>, res : Response) => {
    const postId = req.params.post_id;
    const parsedData = createCommentSchema.parse(req.body);
    const content : string = parsedData.body;
    const userId : string  = req.user?._id!;

    const comment = await commentService.createCommentEntry(postId, content, userId);

    return res
    .status(201)
    .json(new ApiResponse(201, "Comment Get Created", comment));
}


export const getComments = async (req : Request<{post_id : string}>, res : Response) => {
    const postId : string = req.params.post_id;
    
    const comments = await commentService.getCommentsEntries(postId);

    return res
    .status(200)
    .json(new ApiResponse(200, "Comments Fetched For Particular Post", comments));
}

export const deleteComment = async (req : Request<{post_id : string , comment_id : string} >, res : Response) => {
    const {post_id, comment_id} = req.params;
    const userId : string = req.user?._id!;

    const deletedComment = await commentService.deleteCommentEntry(post_id, comment_id, userId);

    return res
    .status(200)
    .json(new ApiResponse(200, "Comment Deleted", {commentId : deletedComment._id}));
}


// export const updateComment = async (req : Request, res : Response) => {
//     const commentId : string = req.params.id as string;
//     const parsedData = updateCommentSchema.parse(req.body);
//     // const content : string = parsedData.body;
//     const userId : string = req.user?._id!;


//     const comment = await commentService.updateCommentEntry(commentId, parsedData, userId);

//     return res
//     .status(200)
//     .json(new ApiResponse(200, "Comment Updated Successfully", comment));
// }