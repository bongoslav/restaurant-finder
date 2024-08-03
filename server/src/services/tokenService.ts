import User from "../models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../config/jwt";
import { Types } from "mongoose";

export const generateTokens = async (userId: Types.ObjectId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.refreshTokens.push(refreshToken);
  await user.save();

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded || !decoded.userId) {
    throw new Error("Invalid refresh token");
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new Error("Invalid refresh token");
  }

  if (!user.refreshTokens.includes(refreshToken)) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  // update the user's refresh tokens
  // remove the old one and add the new one
  user.refreshTokens = user.refreshTokens.filter(
    (token) => token !== refreshToken
  );
  user.refreshTokens.push(newRefreshToken);
  await user.save();

  return { accessToken, refreshToken: newRefreshToken };
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
