import { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { AuthenticatedRequest } from "../types"
dotenv.config()

export const isLoggedIn = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ status: "error", data: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { email: string, username: string }
    req.userData = {
      email: decoded.email,
      username: decoded.username
    };
    next();
  } catch (err) {
    return res.status(401).json({
      status: "error",
      data: err.message
    })
  }
}
