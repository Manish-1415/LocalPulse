import type { NextFunction, Request, Response } from "express";
import ApiError from "../utility/ApiError.js";
import { verifyRefreshToken } from "../utility/tokens.js";

export const validateRefToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) throw new ApiError(400, "Provide Valid Ref Token");

  const isValid = verifyRefreshToken(refreshToken);

  if(!isValid) throw new ApiError(400, "Invalid Token or Token Expired");

  req.refTokenPayload = {...isValid, refreshToken};

  next();
};
