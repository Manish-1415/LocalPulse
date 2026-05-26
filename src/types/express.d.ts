import { JwtAccessPayload } from "../utility/tokens.ts";
import { HydratedDocument } from "mongoose";
import Post from "../modules/post/post.model.ts";

declare global {
  namespace Express {
    interface Request {
      user?: JwtAccessPayload;
      refTokenPayload?: { _id: string; refreshToken: string };
      post?: HydratedDocument<InstanceType<typeof Post.schema>>;
    }
  }
}
