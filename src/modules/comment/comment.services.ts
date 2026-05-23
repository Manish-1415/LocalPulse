import mongoose from "mongoose";
import eventBus from "../../configs/eda_implementation.js";
import ApiError from "../../utility/ApiError.js";
import Post from "../post/post.model.js";
import { Comment } from "./comment.model.js";
import type { UpdateCommentView } from "./comment.validation.js";

const commentService = {
    createCommentEntry : async (postId : string, content : string, userId : string) => {

        const post = await Post.findById(postId);

        if(!post) throw new ApiError(404, "Post Not FOund");
        const postIdAsObjId = new mongoose.Types.ObjectId(postId);
        const userIdAsObjId = new mongoose.Types.ObjectId(userId);

        let comment = await Comment.create({
            post : postIdAsObjId, // string into objectId
            author : userIdAsObjId,
            body : content
        });

        if(!comment) throw new ApiError(500, "Error Occurred while Creating Comment");

        await comment.populate("author");

        eventBus.emit("comment_created", {
            recipient : post.author,
            triggeredBy : userIdAsObjId,
            read : false,
            post : postIdAsObjId,
            type : "comment",
            message :  `${(comment.author as any).name} Commented On Your Post`
            // typescript doesnt know your comment is an actual object containing specific field that's why specifically mention type of it as any
        })

        return comment;
    },

    getCommentsEntries : async (postId : string) => {
        const comments = await Comment.find({post : postId}).sort({createdAt : -1}).lean();

        if(comments.length === 0) return {commentsLength : comments.length, message : "No Comments to return"} 

        return comments;
    },

    // updateCommentEntry : async (commentId : string, content : UpdateCommentView , userId : string) => { 
    //     let updatedComment = await Comment.findByIdAndUpdate(
    //         {_id : commentId, author : userId},
    //         { $set : {body : content} },
    //         {new : true, runValidators : true}
    //     );

    //     if(!updatedComment) throw new ApiError(403, "Comment Not Found Or User is Not Authorized for Comment Update");

    //     return updatedComment;
    // },

    deleteCommentEntry :async (post_id : string,commentId : string, userId : string) => {
        const deletedComment = await Comment.findByIdAndDelete({_id : commentId, post : post_id, author : userId});

        if(!deletedComment) throw new ApiError(403, "Comment Not Found Or User is Not Authorized for this Operation");

        return deletedComment;
    }
}


export default commentService;