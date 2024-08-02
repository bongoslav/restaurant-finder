import { Request, Response } from "express";
import * as reviewService from "../services/reviewService";

export const getAllReviewsForRestaurant = async (
  req: Request,
  res: Response
) => {
  const { restaurantId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
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
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching reviews.",
    });
  }
};
