import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../config/jwt";
import { AuthRequest } from "../types/AuthRequest";
import "dotenv/config";

export const isLoggedIn = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  let accessToken: string | undefined;

  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    accessToken = authHeader.split(" ")[1];
  }

  if (!accessToken) {
    return res.status(401).json({
      status: "error",
      data: "Access token not provided",
    });
  }

  try {
    const payload = verifyAccessToken(accessToken) as { userId: string };

    req.user = { userId: payload.userId };

    next();
  } catch (err) {
    console.error("Error verifying access token:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Access token has expired",
      });
    }

    return res.status(401).json({
      status: "error",
      message: "Invalid access token",
    });
  }
};
