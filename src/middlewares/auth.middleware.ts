import ApiError from "../utility/ApiError.js";
import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken, type JwtAccessPayload } from "../utility/tokens.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let accessToken: string | undefined = req.headers?.authorization;

  if (!accessToken)
    next(new ApiError(400, "Please Provide Valid Authorization"));

  if (!accessToken?.startsWith("Bearer"))
    next(new ApiError(400, "Invalid Token"));

  if (accessToken) {
    accessToken = accessToken.split(" ")[1];

    const isTokenValid: JwtAccessPayload | null = verifyAccessToken(
      accessToken as string
    );

    if (isTokenValid) {
      req.user = isTokenValid;
      next();
    }
  }
};
