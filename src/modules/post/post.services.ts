import ApiError from "../../utility/ApiError.js";
import Post from "./post.model.js";
import { redis } from "../../configs/redisClient.js";
import type { CreatePostView,PostStatus,QueryView ,UpdatePostView } from "./post.types.js";
// import type { updatePost } from "./post.controllers.js";
import type {SortOrder, QueryFilter, InferSchemaType} from "mongoose";
import { type FetchPostsView } from "./post.validations.js";
import type { JwtAccessPayload } from "../../utility/tokens.js";
import { type HydratedDocument } from "mongoose";
import { delFeedCache, delResolvedCache } from "../../configs/deleteFeedCache.js";


const postService = {
  createPostEntry: async (postInfoObj: CreatePostView, userId: string) => {
    const payload = {
      ...postInfoObj,
      author: userId,
    };

    const post = await Post.create(payload);

    await redis.set(`post:${post._id}`, JSON.stringify(post), "EX", 900);

    return post;
  },

  getPostEntry: async (postId: string) => {
    const cache = await redis.get(`post:${postId}`);

    if (cache) return JSON.parse(cache);

    const post = await Post.findById(postId)
      .populate("author", "name, avatar")
      .lean();

    if (!post) throw new ApiError(404, "Post Not Found");

    return post;
  },

  updatePostEntry: async (
    postId: string,
    postInfoObj: UpdatePostView,
    userId: string
  ) => {
    const cache = await redis.get(`post:${postId}`);

    if(cache) await redis.del(`post:${postId}`);

    const updatedPost = await Post.findByIdAndUpdate(
      { _id: postId, author: userId },
      { $set: postInfoObj },
      { new: true, runValidators: true }
    );

    if (!updatedPost) throw new ApiError(403, "Post Not Found or User is Not Authorized for this Operation");

    await redis.set(`post:${postId}`, JSON.stringify(updatedPost), 'EX', 900);

    return updatedPost;
  },

  deletePostEntry : async (postId : string, userId : string) => {
    const cache = await redis.get(`post:${postId}`);

    if(cache) await redis.del(`post:${postId}`);

    const deletedPost = await Post.findByIdAndDelete({_id : postId, author : userId});

    if(!deletedPost) throw new ApiError(403, "User is not authorized or Post Not Found");

    let lng,lat;
    if(deletedPost.location?.coordinates[0] && deletedPost.location?.coordinates[1]) {
      lng = deletedPost.location.coordinates[0];
      lat = deletedPost.location.coordinates[1];

      await delFeedCache(lng, lat);

    }
    return deletedPost;
  },

  fetchPostEntries : async ({lng, lat, lastId, radius, category, sort} : FetchPostsView) => {
    const cacheKey = `feed:${lng}:${lat}:${radius}:${lastId ? lastId : null}`;

    const cache = await redis.get(cacheKey);

    if(cache) return JSON.parse(cache);

    let query : QueryFilter<typeof Post> = {
      status:'open',
      location : {
        $geoWithin : {
          $centerSphere : [
            [lng, lat],
            radius / 6378100  // converts metres into radians
            // Earth radius = 6,378,100 metres
            // mongoDB needs radians not metres
          ]
        }
      }
    }

    // optional filters — only added if provided
    if (category) query.category = category;
    if (lastId) query._id = { $lt: lastId };

    const sortOption : {[key : string] : SortOrder} = sort === "trending" ? { score: -1 } : { createdAt: -1 };

    const posts = await Post.find(query)
      .sort(sortOption)
      .limit(10)
      .populate("author", "name avatar")
      .lean();

    const nextCursor = posts.length === 10 ? posts[posts.length - 1]?._id : null;

    const result = {
      posts,
      nextCursor,
      hasMore: !!nextCursor, // this double excalmation converts result in boolean if value in nextCursor it will become true if not then it will be false.
    };

    // const redisKey = `feed:${lng}:${lat}:${maxDistance}:${sort}:${lastId ? lastId : null}`
    const stringifyResult = JSON.stringify(result);

    await redis.set(cacheKey, stringifyResult, 'EX', 900);

    return result;

  },

  fetchResolvedPostEntries : async (lastId : string, userPayload : JwtAccessPayload) => {
    const cacheKey = `resolved_feed:${userPayload.city}:${lastId ? lastId : null}`;

    const cache = await redis.get(cacheKey);

    if(cache) return JSON.parse(cache);

    const query : QueryFilter<typeof Post> = {
      status : "resolved",
      city : userPayload.city
    }

    if(lastId) query._id = {$lt : lastId};

    const posts = await Post.find(query)
      .sort({ updatedAt: -1 }) // most recently resolved first
      .limit(10)
      .populate("author", "name avatar")
      .lean();

    const nextCursor = posts.length === 10 ? posts[posts.length - 1]?._id : null;

    const result = {
      posts,
      nextCursor,
      hasMore: !!nextCursor,
    };

    await redis.set(cacheKey, JSON.stringify(result), 'EX', 500);

    return result;
  },


  updatePostStatusEntry : async (postP : HydratedDocument<InferSchemaType<typeof Post.schema>>, status : PostStatus) =>{

    const cache = await redis.get(`post:${postP._id}`);

    if(cache) await redis.del(`post:${postP._id}`);

    postP.status = status.status;

    await postP.save();

    let lng, lat;
    if(postP.location?.coordinates[0] && postP.location?.coordinates[1]) {
      lng = postP.location?.coordinates[0];
      lat = postP.location?.coordinates[1];

      await delFeedCache(lng, lat);
    }

    await delResolvedCache(postP.city);

    return postP;
  },
}

export default postService;