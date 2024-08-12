import User from "../models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../config/jwt";
import { Types } from "mongoose";
import { AppError } from "../utils/errorHandler";
import { decode, sign } from "jsonwebtoken";

export const generateTokens = async (userId: Types.ObjectId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  user.refreshTokens.push(refreshToken);
  await user.save();

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  let decoded: { userId: string };
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    // passing the "standard" error to my custom error handling middleware
    throw new AppError(401, "Invalid refresh token");
  }

  if (!decoded || !decoded.userId) {
    throw new AppError(401, "Invalid refresh token");
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new AppError(401, "Invalid refresh token");
  }

  if (!user.refreshTokens.includes(refreshToken)) {
    throw new AppError(401, "Invalid refresh token");
  }

  const accessToken = generateAccessToken(user._id);

  const extendedRefreshToken = extendRefreshTokenLifetime(refreshToken);

  // update the user's refresh tokens
  // replace the old token with the extended one
  user.refreshTokens = user.refreshTokens.map((token) =>
    token === refreshToken ? extendedRefreshToken : token
  );

  await user.save();

  return { accessToken, refreshToken: extendRefreshTokenLifetime };
};

const extendRefreshTokenLifetime = (refreshToken: string): string => {
  const decoded = decode(refreshToken) as { [key: string]: unknown };

  // Extend the expiration by 7 days from now
  const newExp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

  return sign({ ...decoded, exp: newExp }, process.env.REFRESH_TOKEN_SECRET);
};

export const revokeRefreshToken = async (
  userId: Types.ObjectId,
  refreshToken: string
) => {
  await User.updateOne(
    { _id: userId },
    { $pull: { refreshTokens: refreshToken } }
  );
};
