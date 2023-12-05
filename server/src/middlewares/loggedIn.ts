import { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { AuthenticatedRequest } from "../types"
dotenv.config()

export const isLoggedIn = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ status: "error", data: "Access token not provided" });
  }

  try {
    const payload =
      jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET) as { userId: string }
    req.userData = {
      userId: payload.userId,
    };
    next();
  } catch (err) {
    return res.status(500).json({
      status: "error",
      data: err.message
    })
  }
}
