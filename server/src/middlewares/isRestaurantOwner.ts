import { Response, NextFunction } from "express";
import User from "../models/user.model";
import Restaurant from "../models/restaurant.model";
import { AuthRequest } from "../types/AuthRequest";
import { ObjectId } from "mongodb";

export const isRestaurantOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const objectUserId = new ObjectId(req.user.userId);
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return res.status(400).json({
      status: "error",
      message: "Restaurant not found",
    });
  }

  const user = await User.findById(objectUserId);
  if (!user) {
    return res.status(500).json({
      status: "error",
      message: "User not found",
    });
  }

  const ownerId = restaurant.ownerId;

  if (!ownerId.equals(objectUserId)) {
    return res.status(401).json({
      status: "error",
      message: "Logged in user is not restaurant's owner",
    });
  }

  next();
};
