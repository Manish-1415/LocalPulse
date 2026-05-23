import type { Request, Response } from "express";
import ApiResponse from "../../utility/ApiResponse.js";
import {
  createUserSchema,
  loginUserSchema,
  updateProfileSchema,
  updateUserPasswordSchema,
} from "./user.validation.js";
import userService from "./user.services.js";
import type { JwtAccessPayload } from "../../utility/tokens.js";
import type { RefTokenPayloadView, UpdatePasswordView, UpdateUserView } from "./user.types.js";


export const createUser = async (req: Request, res: Response) => {
  const userInfoObj = createUserSchema.parse(req.body);
  // no need for manually throw err'rs now in express 5 u can avoid using async-Handler & try catch
  const user = await userService.createUserEntry(userInfoObj);

  return res
    .status(201)
    .json(new ApiResponse(201, "User Created Successfully", user));
};

export const userLogin = async (req: Request, res: Response) => {
  const userInfoObj = loginUserSchema.parse(req.body);

  const { user, accessToken, refreshToken } = await userService.loginUserEntry(
    userInfoObj
  );

  return res
    .status(201)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 604800000,
    })
    .json(
      new ApiResponse(201, "User Create Successfully", { user, accessToken })
    );
};

export const userLogOut = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const userPayload: JwtAccessPayload = req.user!;

  const user = await userService.logOutUserEntry(userPayload, refreshToken);

  return res
    .status(200)
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .json(
      new ApiResponse(200, "User Logged Out Successfully", {
        message: "User Logged Out",
        user: user?.name,
      })
    );
};

export const getUser = async (req: Request, res: Response) => {
  // const userPayload : JwtAccessPayload = req.user!;
  const userId: string = req.params.id as string;

  const user = await userService.getUserProfile(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, "User Profile Fetched", user));
};

export const updateUser = async (req: Request, res: Response) => {
  const userId: string = req.params.id as string;
  const userInfoObj: UpdateUserView = updateProfileSchema.parse(
    req.body
  ) as UpdateUserView;
  const refreshToken: string = req.cookies.refreshToken;

  const user = await userService.updateUserProfile(
    userId,
    userInfoObj,
    refreshToken
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "User Profile Updation complete", user));
};

export const updatePassword = async (req: Request, res: Response) => {
  const userInfoObj: UpdatePasswordView = updateUserPasswordSchema.parse(
    req.body
  );
  const userId: string = req.params.id as string;
  const refreshToken: string = req.cookies.refreshToken;

  const user = await userService.updateUserPassword(
    userInfoObj,
    userId,
    refreshToken
  );

  return res
    .status(200)
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .json(new ApiResponse(200, "Password Successfully Updated", user));
};

export const newAccessToken = async (req: Request, res: Response) => {
  const userPaylod : RefTokenPayloadView = req.refTokenPayload!;

  const { user, accessToken } = await userService.generateNewAccessToken(
    userPaylod
  );

  return res
    .status(201)
    .json(
      new ApiResponse(201, "Access Token Generated", { user, accessToken })
    );
};
