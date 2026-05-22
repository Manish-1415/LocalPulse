import type { NextFunction, Request, Response } from "express";
import ApiError from "../utility/ApiError.js";
import { verifyAccessToken, verifyRefreshToken } from "../utility/tokens.js";

import type { JwtAccessPayload, JwtRefreshToken } from "../utility/tokens.js";

const isGuest = (req: Request, res: Response, next: NextFunction) => {
  let accessToken: string | undefined = req.headers?.authorization;
  const refreshToken: string | undefined = req.cookies?.refreshToken;

  if(!accessToken && !refreshToken) throw new ApiError(400, "Please Provide Valid JWT Tokens");

  if (accessToken || refreshToken) {
    let isUserValid: boolean = false;

    if (accessToken && accessToken?.startsWith("Bearer ")) {
      const accessTokenPayload: JwtAccessPayload | null =
        verifyAccessToken(accessToken);
      if (accessTokenPayload) isUserValid = true;
    }

    if (!isUserValid && refreshToken) {
      const refTokenPayload: JwtRefreshToken | null =
        verifyRefreshToken(refreshToken);
      if (refTokenPayload) isUserValid = true;
    }

    if (isUserValid) {
      return res.status(400).json({
        success: false,
        authenticated: true,
        message: "User is already logged in.",
        redirectTo: "/api/v1/posts/", // Hand the path over for the frontend to route manually
      });
    }
  }

  next();
};

export default isGuest;
