import ApiError from "../../utility/ApiError.js";
// import { createUserSchema } from "./user.validation.js";
import User from "./user.model.js";
import type { CreateUserView, LoginUserView, RefTokenPayloadView, UpdatePasswordView, UpdateUserView } from "./user.types.js";
// import type { IUser } from "./user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  type JwtAccessPayload,
} from "../../utility/tokens.js";
import bcrypt from "bcrypt"
import { redis } from "../../configs/redisClient.js";
import { mediaQueue } from "../../message_queue/queue.implementation.js";

// caching added

const userService = {
  createUserEntry: async (userInfoObj: CreateUserView) => {
    const user = await User.create(userInfoObj);

    return user;
  },

  loginUserEntry: async (userInfoObj: LoginUserView) => {
    let user = await User.findOne({ email: userInfoObj.email }).select("+passwordHash");

    if (!user) throw new ApiError(404, "User Not Found");

    const isPassCorrect = await user.comparePassword(userInfoObj.passwordHash);

    if (!isPassCorrect) throw new ApiError(400, "Invalid Password");

    const accessToken = generateAccessToken({
      _id: user._id.toString(),
      name: user.name,
      role: user.role,
      email: user.email,
    });

    if (!accessToken)
      throw new ApiError(500, "Error Occurred while Generating Access Token");

    let refreshToken = generateRefreshToken({
      _id: user._id.toString(),
    });

    if (!refreshToken)
      throw new ApiError(500, "Error Occurred while Generating Refresh Token");

    const hashedRefToken = await bcrypt.hash(refreshToken, 10);

    user.refreshToken = hashedRefToken;
    await user.save();

    return {user, accessToken, refreshToken}
  },

  logOutUserEntry : async (userPayload : JwtAccessPayload, refreshToken : string) => {
    let user = await User.findOne({_id : userPayload._id});

    if(!user) throw new ApiError(404, "User Not Found");

    if(user.refreshToken && typeof user.refreshToken === "string") {
      const isRefTokenValid : boolean = await bcrypt.compare(refreshToken, user.refreshToken);

      if(!isRefTokenValid) throw new ApiError(400, "Invalid Ref Token");

      user.refreshToken = null;
      await user.save();

      return user; 
    }

  },

  getUserProfile : async(userId : string) => {
    const userCache = await redis.get(`user:${userId}`);

    if(userCache) return JSON.parse(userCache);
 
    const user = await User.findById(userId).select("-passwordHash -refreshToken").lean();

    if(!user) throw new ApiError(404, "User Not Found");

    redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 900);

    return user;
  },


  updateUserProfile : async (userId : string , userInfoObj : UpdateUserView, refrehToken : string) => {
    
    const userCache = await redis.get(`user:${userId}`);

    if(userCache) await redis.del(`user:${userId}`);

    const user = await User.findById(userId);

    if(!user) throw new ApiError(404, "User not Found");

    if(user.refreshToken) {
      const isTokenValid = await bcrypt.compare(refrehToken, user.refreshToken);
      if(!isTokenValid) throw new ApiError(400, "User is not authorized to perform this Operation");
    }

    // store user avatar url to delete it from cloudinary - 
    if(userInfoObj.avatar?.public_id && user.avatar?.public_id) {
      const public_id : string = user.avatar.public_id;

      await mediaQueue.add("media-delete", public_id);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {$set : userInfoObj},
      {new : true, runValidators : true}
    );

    if(!updatedUser) throw new ApiError(500, "Error Occur While Updating User Profile");

    await redis.set(`user:${userId}`, JSON.stringify(updatedUser) , 'EX', 900);

    return updatedUser;
  },

  updateUserPassword : async (userInfoObj : UpdatePasswordView, userId : string, refrehToken : string) => {
    const userCache = await redis.get(`user:${userId}`);

    if(userCache) await redis.del(`user:${userId}`);

    let user = await User.findById(userId);

    if(!user) throw new ApiError(404, "User Not Found");

    const ifOldPassCorrect : boolean = await user.comparePassword(userInfoObj.oldPassword);

    if(!ifOldPassCorrect) throw new ApiError(400, "Please Provide Valid Password");

    if(user.refreshToken) {
      const isTokenValid = await bcrypt.compare(refrehToken, user.refreshToken);
      if(!isTokenValid) throw new ApiError(403, "User is not authorized for this Operation");
    }

    user.refreshToken = null;
    user.passwordHash = "";
    user.passwordHash = await bcrypt.hash(userInfoObj.newPassword, 12);

    await user.save();

    await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 900);

    return user;
  },

  generateNewAccessToken : async (userPayload : RefTokenPayloadView) => {
    let user = await User.findById(userPayload._id).lean();

    if(!user) throw new ApiError(404, "User Not Found");

    if(!user.refreshToken) throw new ApiError(400, "User is not loggedIn");

    const compareRefToken = await bcrypt.compare(userPayload.refreshToken, user.refreshToken);

    if(!compareRefToken) throw new ApiError(403, "User is Unauthorized for this Operation");

    const accessToken = generateAccessToken({
      name : user.name,
      email : user.email,
      role : user.role,
      _id : user._id.toString()
    });

    return {user, accessToken}
  }
};

export default userService;
