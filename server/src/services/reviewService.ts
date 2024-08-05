import { AppError } from "../utils/errorHandler";
import Restaurant from "../models/restaurant.model";
import { Types } from "mongoose";

const checkForRestaurant = async (restaurantId: string) => {
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    throw new AppError(404, "Restaurant not found");
  }

  return restaurant;
};

export const getAllReviewsForRestaurant = async (
  restaurantId: string,
  page: number,
  limit: number
) => {
  const restaurant = await checkForRestaurant(restaurantId);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const reviews = restaurant.reviews.slice(startIndex, endIndex);
  const totalReviews = restaurant.reviews.length;
  const totalPages = Math.ceil(totalReviews / limit);

  return {
    reviews,
    totalPages,
    totalReviews,
  };
};

export const addReview = async (
  restaurantId: string,
  title: string,
  userId: Types.ObjectId,
  rating: number,
  text: string
) => {
  const restaurant = await checkForRestaurant(restaurantId);

  const totalRatings =
    (restaurant.reviewCount || 0) * (restaurant.averageRating || 0) + rating;
  const newReviewCount = (restaurant.reviewCount || 0) + 1;
  const newAverageRating = Number((totalRatings / newReviewCount).toFixed(1));

  try {
    const result = await Restaurant.findByIdAndUpdate(
      restaurantId,
      {
        $push: {
          reviews: { title, userId, rating, text, createdAt: new Date() },
        },
        $inc: { reviewCount: 1 },
        $set: { averageRating: newAverageRating },
      },
      { new: true, runValidators: true }
    );

    return result;
  } catch (error) {
    console.error("Error in adding review:", error.message);
    throw new AppError(500, "Failed to add review");
  }
};

export const getReviewForRestaurant = async (
  restaurantId: string,
  reviewId: Types.ObjectId
) => {
  const restaurant = await checkForRestaurant(restaurantId);

  const review = restaurant.reviews.find((review) =>
    review._id.equals(reviewId)
  );

  if (!review) {
    throw new AppError(404, "Review not found");
  }

  return review;
};

export const deleteReview = async (
  restaurantId: string,
  reviewId: Types.ObjectId
) => {
  await checkForRestaurant(restaurantId);
  try {
    await Restaurant.findOneAndUpdate(
      { _id: restaurantId },
      [
        {
          $set: {
            reviews: {
              $filter: {
                input: "$reviews",
                cond: { $ne: ["$$this._id", reviewId] },
              },
            },
            reviewCount: { $subtract: ["$reviewCount", 1] },
            averageRating: {
              $round: [
                {
                  $cond: [
                    { $eq: [{ $size: "$reviews" }, 1] },
                    0,
                    {
                      $avg: {
                        $filter: {
                          input: "$reviews.rating",
                          cond: { $ne: ["$$this._id", reviewId] },
                        },
                      },
                    },
                  ],
                },
                1,
              ],
            },
          },
        },
      ],
      { new: true, runValidators: true }
    );
  } catch (error) {
    console.error("Error in deleting review:", error.message);
    throw new AppError(500, "Failed to delete review");
  }
};
