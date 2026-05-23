import type { Request, Response } from "express";
import ApiResponse from "../../utility/ApiResponse.js";
import type { CreatePostView, PostStatus } from "./post.types.js";
import { createPostSchema, fetchPostsSchema, updatePostSchema, updatePostStatusSchema, type FetchPostsView, type UpdatePostInput } from "./post.validations.js";
import postService from "./post.services.js";
import type { JwtAccessPayload } from "../../utility/tokens.js";
// import type { UpdatePostInput } from "./post.validations.js";
import type { HydratedDocument } from "mongoose";
import { type InferSchemaType } from "mongoose";
import Post from "./post.model.js";

// first param is params, then resBody, then reqBody, then query then local(not needed much)
export const createPost = async (req: Request<{},{},CreatePostView>, res: Response) => {
  const postInfoObj = createPostSchema.parse(req.body);
  const user : string = req.user?._id!;

  const post = await postService.createPostEntry(postInfoObj, user);

  return res
  .status(201)
  .json(new ApiResponse(201, "Post Created Successfully", post));
};


export const getPost = async (req : Request<{id : string}>, res : Response) => {
  const postId : string = req.params.id;

  const post = await postService.getPostEntry(postId);

  return res
  .status(200)
  .json(new ApiResponse(200, "Post Fetched Successfully", post));
}


export const updatePost = async (req : Request<{id : string}, {}, UpdatePostInput>, res : Response) => {
  const postInfoObj = updatePostSchema.parse(req.body);
  const postId = req.params.id;
  const userId = req.user?._id!;

  const post = await postService.updatePostEntry(postId, postInfoObj, userId);

  return res
  .status(200)
  .json(new ApiResponse(200, "Post Updated Successfully", post));
}


export const fetchPosts = async (req : Request, res : Response) => {

    const validatedData = fetchPostsSchema.parse({
      lng: Number(req.params.lng),
      lat: Number(req.params.lat),
      radius: Number(req.params.radius),
      category: req.params.category || undefined, // handles optional empty values
      lastId: req.params.lastId || undefined,
      sort: req.params.sort
    });

    const posts = await postService.fetchPostEntries(validatedData)

  return res
  .status(200)
  .json(new ApiResponse(200, "Posts Fetched For User", posts));
}


export const fetchResolvedPost = async (req : Request<{},{},{},{lastId : string}>, res : Response) => {
  const lastId = req.query.lastId;
  const userPayload : JwtAccessPayload = req.user!;

  const resolvedPosts = await postService.fetchResolvedPostEntries(lastId, userPayload);

  return res
  .status(200)
  .json(new ApiResponse(200, "Resolved Posts Fetched", resolvedPosts));
}


export const updatePostStatus = async (req : Request<{},{},PostStatus>, res : Response) => {

  const status = updatePostStatusSchema.parse(req.body);

  const post : HydratedDocument<InferSchemaType<typeof Post.schema>> = req.post;

  const updatedPost = await postService.updatePostStatusEntry(post, status, req.user?._id as string);

  return res
  .status(200)
  .json(new ApiResponse(200, "Post Status Updated", updatedPost));
}



export const deletePost = async (req : Request<{id : string}>, res : Response) => {
  const postId = req.params.id;
  const userId = req.user?._id!;

  const post = await postService.deletePostEntry(postId, userId);

  return res
  .status(200)
  .json(new ApiResponse(200, "Post Deleted Successfully", {post : post.title, postId : post._id, message : "Post Deleted"}));
}