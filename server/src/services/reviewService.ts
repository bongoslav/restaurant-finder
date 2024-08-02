import Restaurant from "../models/restaurant.model";
import { Types } from "mongoose";

const checkForRestaurant = async (restaurantId: string) => {
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    throw new Error("Restaurant not found");
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
  userId: string,
  rating: number,
  text: string
) => {
  const restaurant = await checkForRestaurant(restaurantId);

  if (!rating || !title || !text || !userId) {
    throw new Error("Invalid data");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Invalid data");
  }

  try {
    restaurant.reviews.push({ title, userId, rating, text });
    await restaurant.save();
  } catch (error) {
    console.error("Error in adding review:", error.message);
    throw new Error("Failed to add review");
  }

  return restaurant;
};

export const getReviewForRestaurant = async (
  restaurantId: string,
  reviewId: Types.ObjectId
) => {
  const restaurant = await checkForRestaurant(restaurantId);
  console.log(restaurant.reviews[0]._id);
  console.log(reviewId);

  const review = restaurant.reviews.find((review) =>
    review._id.equals(reviewId)
  );

  return review;
};