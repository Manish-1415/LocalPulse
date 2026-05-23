import type { Request, Response } from "express";
import { toggleVoteSchema, type Vote } from "./vote.validation.js";
import voteService from "./vote.services.js";
import ApiResponse from "../../utility/ApiResponse.js";



export const toggleVote = async (req : Request<{post_id : string}>, res : Response) => {
    const postId : string = req.params.post_id;
    const userId : string = req.user?._id!;
    const voteType : Vote = toggleVoteSchema.parse(req.body);

    const vote = await voteService.toggleVoteEntry(postId, userId, voteType);

    return res
    .status(201)
    .json(new ApiResponse(201, "Vote Toggled Successfully", vote));
}