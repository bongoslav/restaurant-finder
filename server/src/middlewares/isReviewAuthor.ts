import { NextFunction, Response } from "express";
import { ObjectId } from "mongodb";
import { AuthRequest } from "../types/AuthRequest";
import Restaurant from "../models/restaurant.model";
import { AppError } from "../utils/errorHandler";

export const isReviewAuthor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userObjectId = new ObjectId(req.user.userId);
  const { reviewId, restaurantId } = req.params;
  const reviewObjectId = new ObjectId(reviewId);

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new AppError(404, "Restaurant not found");
  }

  const review = restaurant.reviews.find((review) =>
    review._id.equals(reviewObjectId)
  );
  if (!review) {
    throw new AppError(404, "Review not found");
  }

  const isAuthor = review.userId.equals(userObjectId);
  if (!isAuthor) {
    throw new AppError(401, "Logged in user is not the review's author");
  }

  next();
};
