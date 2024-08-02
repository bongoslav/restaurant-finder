import { Request, Response } from "express";
import * as reviewService from "../services/reviewService";
import { Types } from "mongoose";

export const getAllReviewsForRestaurant = async (
  req: Request,
  res: Response
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
    console.log(error.message);

    if (error.message === "Restaurant not found") {
      res.status(404).json({
        status: "error",
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "An error occurred while fetching reviews.",
      });
    }
  }
};

export const addReview = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    // TODO after auth update
    const userId = "66aabdb36b70547533a0e605";
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
    if (error.message === "Restaurant not found") {
      res.status(404).json({
        status: "error",
        message: error.message,
      });
    } else if (error.message === "Failed to add review") {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    } else if (error.message === "Invalid data") {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "An error occurred while fetching reviews.",
      });
    }
  }
};

export const getReviewForRestaurant = async (req: Request, res: Response) => {
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
    if (
      error.message === "Restaurant not found" ||
      error.message === "Review not found"
    ) {
      res.status(404).json({
        status: "error",
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "An error occurred while fetching reviews.",
      });
    }
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { restaurantId, reviewId } = req.params;
    const reviewObjectId = new Types.ObjectId(reviewId);
    await reviewService.deleteReview(restaurantId, reviewObjectId);
    res.status(204).send();
  } catch (error) {
    if (
      error.message === "Restaurant not found" ||
      error.message === "Review not found"
    ) {
      res.status(500).json({
        status: "error",
        message: "An error occurred while deleting the review.",
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "An error occurred while fetching reviews.",
      });
    }
  }
};
