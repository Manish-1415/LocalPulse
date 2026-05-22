import {z} from "zod";


export const removePostStatusSchema = z.object({
    status : z.enum(["removed"])
})

export const postResolutionSchema = z.object({
    status : z.enum(["reviewed", "dismissed"])
})