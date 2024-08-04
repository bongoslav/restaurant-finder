import { Response, NextFunction } from "express";
import User from "../models/user.model";
import Restaurant from "../models/restaurant.model";
import { AuthRequest } from "../types/AuthRequest";
import { ObjectId } from "mongodb";
import { AppError } from "../utils/errorHandler";

export const isRestaurantOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const objectUserId = new ObjectId(req.user.userId);
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return next(new AppError(404, "Restaurant not found"));
  }

  const user = await User.findById(objectUserId);
  if (!user) {
    return next(new AppError(404, "User not found"));
  }

  const ownerId = restaurant.ownerId;

  if (!ownerId.equals(objectUserId)) {
    return next(new AppError(403, "Logged in user is not restaurant's owner"));
  }

  next();
};
