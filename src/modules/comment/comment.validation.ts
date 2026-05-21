import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1)
    .max(500),
});

export type CreateCommentView = z.infer<typeof createCommentSchema>;



export const updateCommentSchema = z.object({
    body : z
    .string()
    .trim()
    .min(1)
    .max(500)
})

export type UpdateCommentView = z.infer<typeof updateCommentSchema>;