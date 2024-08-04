import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../config/jwt";
import { AuthRequest } from "../types/AuthRequest";
import "dotenv/config";
import { AppError } from "../utils/errorHandler";

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
    return next(new AppError(401, "Access token not provided"));
  }

  try {
    const payload = verifyAccessToken(accessToken) as { userId: string };

    req.user = { userId: payload.userId };

    next();
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(401, error.message));
    } else {
      next(new AppError(401, "Invalid access token"));
    }
  }
};
