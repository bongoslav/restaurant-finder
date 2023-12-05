import { sign } from "jsonwebtoken";
import User from "../../models/user.model";
import { Response } from "express";

export const createAccessToken = (user: User) => {
  return sign(
    { userId: user.id },
    process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "15s"
  })
}

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "7d"
  })
}

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("jid", token, {
    httpOnly: true,
  })
}