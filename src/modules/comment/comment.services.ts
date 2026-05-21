import ApiError from "../../utility/ApiError.js";
import { Comment } from "./comment.model.js";
import type { UpdateCommentView } from "./comment.validation.js";

const commentService = {
    createCommentEntry : async (postId : string, content : string, userId : string) => {
        const comment = await Comment.create({
            post : postId,
            author : userId,
            body : content
        });

        if(!comment) throw new ApiError(500, "Error Occurred while Creating Comment");

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