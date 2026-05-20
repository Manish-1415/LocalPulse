import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().trim().min(5).max(100),

  body: z.string().min(10).max(2000),

  category: z.enum(["road", "safety", "event", "civic", "noise", "other"]),

  images: z
    .array(
      z.object({
        url: z.string().url(),
        public_id: z.string(),
      })
    )
    .default([]),

  location: z.object({
    type: z.literal("Point").default("Point"),
    coordinates: z.array(z.number()).length(2),
  }),

  city: z.string().trim(),

  status: z.enum(["open", "resolved", "removed"]).default("open"),

  tags: z.array(z.string()).default([]),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;




const basePostSchema = z.object({
  title: z.string().trim().min(5).max(100),
  body: z.string().min(10).max(2000),
  category: z.enum(['road', 'safety', 'event', 'civic', 'noise', 'other']),
  images: z.array(
    z.object({
      url: z.string().url(),
      public_id: z.string(),
    })
  ),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.array(z.number()).length(2),
  }),
  city: z.string().trim(),
  status: z.enum(['open', 'resolved', 'removed']),
  tags: z.array(z.string()),
});

// 2. Make all fields optional AND enforce that at least one key exists
export const updatePostSchema = basePostSchema
  .partial() // Makes every field optional
  .refine(
    (data) => Object.keys(data).length > 0, 
    { message: "At least one field must be provided for update" }
  );

export type UpdatePostInput = z.infer<typeof updatePostSchema>;




export const fetchPostsSchema = z.object({
  lng: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
  radius: z.number().positive(),
  category: z.enum(["road", "safety", "event", "civic", "noise", "other"]).optional(),
  lastId: z.string().optional(),
  sort: z.enum(["recent", "trending"])
});

// no need to manually write the types for this in your types this can directly used as type
export type FetchPostsView = z.infer<typeof fetchPostsSchema>;


export const updatePostStatusSchema = z.object({
  status : z.enum(["resolved", "removed"])
})