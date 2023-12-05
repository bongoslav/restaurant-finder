import { Response, NextFunction } from "express";
import User from "../models/user.model";
import { AuthenticatedRequest } from "../types";
import Restaurant from "../models/restaurant.model";

export const isOwner = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let restaurant: Restaurant;
  let user: User;
  try {
    user = await User.findOne({ where: { id: req.userData.userId } })
  } catch (err) {
    return res.status(400).json({ message: "User not found" })
  }

  try {
    restaurant = await Restaurant.findOne({ where: { id: req.params.id } })
  } catch (err) {
    return res.status(400).json({ message: "Restaurant not found" })
  }

  const ownerId = restaurant.ownerId

  if (ownerId != user.id) {
    return res.status(400).json({ message: "Logged in user is not an owner" })
  }

  next();
}