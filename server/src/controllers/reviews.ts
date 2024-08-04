import { NextFunction, Request, Response } from "express";
import * as reviewService from "../services/reviewService";
import { Types } from "mongoose";
import { AuthRequest } from "../types/AuthRequest";

export const getAllReviewsForRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { restaurantId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await reviewService.getAllReviewsForRestaurant(
      restaurantId,
      page,
      limit
    );

    res.status(200).json({
      status: "success",
      data: result.reviews,
      pagination: {
        currentPage: page,
        totalPages: result.totalPages,
        totalReviews: result.totalReviews,
        hasNextPage: page < result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { restaurantId } = req.params;
    const userId = new Types.ObjectId(req.user.userId);
    const { title, rating, text } = req.body;

    const restaurant = await reviewService.addReview(
      restaurantId,
      title,
      userId,
      rating,
      text
    );

    res.status(201).json({
      status: "success",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewForRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { restaurantId, reviewId } = req.params;
    // in order to compare it with the document's id
    const reviewObjectId = new Types.ObjectId(reviewId);
    const review = await reviewService.getReviewForRestaurant(
      restaurantId,
      reviewObjectId
    );

    res.status(200).json({
      status: "success",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { restaurantId, reviewId } = req.params;
    const reviewObjectId = new Types.ObjectId(reviewId);
    await reviewService.deleteReview(restaurantId, reviewObjectId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
