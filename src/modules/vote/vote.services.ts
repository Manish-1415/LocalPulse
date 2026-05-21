import ApiError from "../../utility/ApiError.js";
import Vote from "./vote.model.js";
import type { Vote as VoteType } from "./vote.validation.js";
import Post from "../post/post.model.js";

// 1. Explicitly define a unified return structure for your controller payload
interface VoteResponse {
    vote: any | null;
    upvotes: number;
    downvotes: number;
    message: string;
}

const voteService = {
    toggleVoteEntry: async (postId: string, userId: string, voteType: VoteType): Promise<VoteResponse> => {

        const post = await Post.findById(postId);
        if (!post) throw new ApiError(404, "Post Not Found");

        const vote = await Vote.findOne({ post: postId, user: userId });

        // PATH 1: No vote entry exists -> Create one
        if (!vote) {
            const newVote = await Vote.create({ post: postId, user: userId, type: voteType.type });
            if (!newVote) throw new ApiError(500, "Error Occurred while Making Vote Entry");

            voteType.type === "upvote" ? post.upvotes += 1 : post.downvotes += 1;
            await post.save();

            return { 
                vote: newVote, 
                upvotes: post.upvotes, 
                downvotes: post.downvotes, 
                message: "Vote registered successfully" 
            };
        }

        // PATH 2: Vote exists and is the SAME type -> Remove it (Undo vote)
        if (vote.type === voteType.type) {
            await vote.deleteOne();

            voteType.type === "upvote" ? post.upvotes -= 1 : post.downvotes -= 1;
            await post.save();

            return { 
                vote: null, 
                upvotes: post.upvotes, 
                downvotes: post.downvotes, 
                message: "Vote Deleted Successfully" 
            };
        }

        // PATH 3: Vote exists but is a DIFFERENT type -> Switch it (Upvote <-> Downvote)
        vote.type = voteType.type;
        await vote.save(); // Using save is simpler and cleaner than updateOne here

        if (voteType.type === "upvote") {
            post.upvotes += 1;
            post.downvotes -= 1;
        } else {
            post.downvotes += 1;
            post.upvotes -= 1;
        }
        await post.save();

        return { 
            vote, 
            upvotes: post.upvotes, 
            downvotes: post.downvotes, 
            message: "Vote toggled successfully" 
        };
    }
};

export default voteService;