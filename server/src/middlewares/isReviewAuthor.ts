import { NextFunction, Response } from "express";
import { ObjectId } from "mongodb";
import { AuthRequest } from "../types/AuthRequest";
import Restaurant from "../models/restaurant.model";

export const isReviewAuthor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userObjectId = new ObjectId(req.user.userId);
  const { reviewId, restaurantId } = req.params;
  const reviewObjectId = new ObjectId(reviewId);

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const review = restaurant.reviews.find((review) =>
      review._id.equals(reviewObjectId)
    );
    if (!review) {
      throw new Error("Review not found");
    }

    const isAuthor = review.userId.equals(userObjectId);
    if (!isAuthor) {
      throw new Error("Logged in user is not the review's author");
    }

    next();
  } catch (error) {
    if (
      error.message === "Restaurant not found" ||
      error.message === "Review not found"
    ) {
      res.status(404).json({
        status: "error",
        message: error.message,
      });
    } else {
      res.status(401).json({
        status: "error",
        message: error.message,
      });
    }
  }
};
