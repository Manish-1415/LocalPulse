import {z} from "zod";

export type Vote = {
    type : "upvote" | "downvote";
}


export const toggleVoteSchema = z.object({
    type : z.enum(["upvote", "downvote"])
});