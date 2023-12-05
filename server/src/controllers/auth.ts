import { Request, Response } from "express";
import bcrypt from "bcrypt"
import User from "../models/user.model";
import { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv";
import { AuthenticatedRequest } from "../types";
import { verify } from "jsonwebtoken";
import { createAccessToken, createRefreshToken, sendRefreshToken } from "../util/auth/tokens";
dotenv.config();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll()
    return res.json({
      users: users
    })
  } catch (err) {
    return res.status(400).json({ err })
  }
}

export const login = async (req: Request, res: Response) => {
  const email: string = req.body.email
  const password: string = req.body.password

  // TODO: validation

  try {
    const user = await User.findOne({ where: { email } })
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ message: "Wrong password." })
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.status(200).json({ accessToken: createAccessToken(user) })
  } catch (err) {
    return res.status(404).json({ message: "User not found." })
  }
}

export const register = async (req: Request, res: Response) => {
  const email: string = req.body.email
  const username: string = req.body.username
  const name: string = req.body.name
  const password: string = req.body.password
  // TODO: validation

  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    await User.create({ email, username, name, password: hash });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Registration error:", err); // Log the specific error for debugging purposes
    return res.status(500).json({ message: "Something went wrong while registering." });
  }
}

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findOne({ where: { id: req.userData.userId } })
    return res.status(200).json({ user })
  } catch (err) {
    return res.status(404).json({ message: "User not found" })
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.jid
  if (!token) {
    return res.status(404).json({ message: "No refresh token provided", accessToken: "" })
  }

  let payload: JwtPayload;
  try {
    payload = verify(token, process.env.JWT_REFRESH_TOKEN_SECRET) as JwtPayload;
  } catch (err) {
    return res.status(404).json({ message: "Wrong refresh token", accessToken: "" })
  }

  // token is valid and we can send back an access token
  const user = await User.findOne({ where: { id: payload.userId } });

  if (!user) {
    return res.status(404).json({ message: "No user found with such id", accessToken: "" })
  }

  // refresh token has been invalidated
  if (user.tokenVersion !== payload.tokenVersion) {
    return res.status(404).json({ message: "Invalid token", accessToken: "" })
  }

  sendRefreshToken(res, createRefreshToken(user));

  return res.status(200).json({ message: "ok", accessToken: createAccessToken(user) })
}

export const revokeRefreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.jid
  let payload: JwtPayload;

  try {
    payload = verify(token, process.env.JWT_REFRESH_TOKEN_SECRET) as JwtPayload;
  } catch (err) {
    return res.status(404).json({ message: "Wrong refresh token", accessToken: "" })
  }

  const user = await User.findOne({ where: { id: payload.userId } });
  user.tokenVersion += 1;
  await user.save();
  return res.status(200).json({ message: "ok" })
}