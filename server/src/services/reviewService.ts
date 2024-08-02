import Restaurant from "../models/restaurant.model";

export const getAllReviewsForRestaurant = async (
  restaurantId: string,
  page: number,
  limit: number
) => {
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

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
