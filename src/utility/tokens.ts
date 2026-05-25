import jwt from "jsonwebtoken";

export interface JwtAccessPayload {
  _id: string;
  name: string;
  role: "user" | "admin";
  email: string;
  city: string;
}

export type JwtRefreshToken = { _id: string };

const accessSecretKey = process.env.ACCESS_SECRET_KEY!;

export const generateAccessToken = (
  paylod: JwtAccessPayload
): string | undefined => {
  try {
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRY || "15m";
    const accessToken = jwt.sign(paylod, accessSecretKey, {
      expiresIn: expiresIn as any,
    });

    if (accessToken) return accessToken;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const refreshSecretKey = process.env.REFRESH_SECRET_KEY!;

export const generateRefreshToken = (
  paylod: JwtRefreshToken
): string | undefined => {
  try {
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRY || "7d";
    const refreshToken = jwt.sign(paylod, refreshSecretKey, {
      expiresIn: expiresIn as any,
    });

    if (refreshToken) return refreshToken;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const verifyAccessToken = (token: string): JwtAccessPayload | null => {
  try {
    return jwt.verify(token, accessSecretKey) as JwtAccessPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtRefreshToken | null => {
  try {
    // Type assertion guarantees the returned object matches your interface structure
    return jwt.verify(token, refreshSecretKey) as JwtRefreshToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};
