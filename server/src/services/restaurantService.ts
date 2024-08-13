import { Types } from "mongoose";
import Restaurant from "../models/restaurant.model";
import { AppError } from "../utils/errorHandler";
import { GetAllRestaurantsQueryParams } from "../controllers/restaurants";

// TODO: check again to replace aggregation
interface AggregatedRestaurant {
  _id: Types.ObjectId;
  name: string;
  location: string;
  priceRange: number;
  cuisine: string;
  ownerId: Types.ObjectId;
  images: string[];
  hours: string[];
  reviewCount: number;
  averageRating: number;
}

export interface UpdateRestaurantBody {
  name?: string;
  location?: string;
  priceRange?: number;
  cuisine?: string;
  hours?: string[];
}

export const getAllRestaurants = async (
  options: GetAllRestaurantsQueryParams & { limit: string }
) => {
  const {
    page,
    search,
    cuisine,
    minPrice,
    maxPrice,
    minReviews,
    maxReviews,
    sortBy,
    sortOrder,
    limit,
  } = options;

  const pageNumber = parseInt(page as string);
  const minPriceNumber = parseInt(minPrice as string);
  const maxPriceNumber =
    maxPrice === "Infinity" ? Infinity : parseInt(maxPrice as string);
  const minReviewsNumber = parseInt(minReviews as string);
  const maxReviewsNumber =
    maxReviews === "Infinity" ? Infinity : parseInt(maxReviews as string);
  const sortOrderNumber = sortOrder === "asc" ? 1 : -1;
  const limitNumber = parseInt(limit);

  const query = {
    name: { $regex: search, $options: "i" },
    cuisine: cuisine ? cuisine : { $exists: true },
    priceRange: { $gte: minPriceNumber, $lte: maxPriceNumber },
    reviewCount: { $gte: minReviewsNumber, $lte: maxReviewsNumber },
  };

  const skip = (pageNumber - 1) * limitNumber;

  const totalRestaurants = await Restaurant.countDocuments(query);

  const restaurants = await Restaurant.find(query)
    .select("-reviews") // exclude the "reviews" field
    .skip(skip)
    .limit(limitNumber)
    .sort({ [sortBy]: sortOrderNumber });

  const totalPages = Math.ceil(totalRestaurants / limitNumber);

  return {
    restaurants,
    page,
    totalPages: totalPages,
    totalRestaurants,
    hasNextPage: pageNumber < totalPages,
  };
};

export const getAllCuisines = async () => {
  try {
    return await Restaurant.distinct("cuisine");
  } catch (error) {
    console.error("Error fetching all cuisines:", error);
    throw new AppError(500, "Failed to fetch all cuisines");
  }
};

export const getRestaurantById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid restaurant ID");
  }

  const restaurant = await Restaurant.findById(id);

  if (!restaurant) {
    throw new AppError(404, "Restaurant not found");
  }

  return restaurant;
};

export const createRestaurant = async (
  name: string,
  location: string,
  priceRange: number,
  cuisine: string,
  userId: string,
  hours: string[]
) => {
  const objectUserId = new Types.ObjectId(userId);

  const newRestaurant = new Restaurant({
    name,
    location,
    priceRange,
    cuisine,
    ownerId: objectUserId,
    images: [],
    hours: hours,
    reviews: [],
  });

  try {
    await newRestaurant.save();
  } catch (error) {
    console.error("Error saving restaurant:", error);
    throw new AppError(500, "Failed to create restaurant");
  }

  // because of `reviewCount` and `averageRating`
  const restaurantResponse: AggregatedRestaurant = {
    _id: newRestaurant._id,
    name: newRestaurant.name,
    location: newRestaurant.location,
    priceRange: newRestaurant.priceRange,
    cuisine: newRestaurant.cuisine,
    images: newRestaurant.images,
    ownerId: newRestaurant.ownerId,
    hours: newRestaurant.hours,
    reviewCount: 0,
    averageRating: 0,
  };

  return restaurantResponse;
};

export const updateRestaurant = async (
  id: string,
  body: UpdateRestaurantBody
) => {
  const updateFields: Partial<UpdateRestaurantBody> = {};

  if (body.name !== undefined) updateFields.name = body.name;
  if (body.location !== undefined) updateFields.location = body.location;
  if (body.priceRange !== undefined) updateFields.priceRange = body.priceRange;
  if (body.cuisine !== undefined) updateFields.cuisine = body.cuisine;
  if (body.hours !== undefined) updateFields.hours = body.hours;

  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
        // don't return reviews as it's inefficient and unnecessary
        projection: { reviews: 0 },
      }
    );

    return {
      _id: updatedRestaurant._id,
      ...updateFields,
    };
  } catch (error) {
    console.error("Error updating restaurant:", error);
    throw new AppError(500, "Failed to update restaurant");
  }
};

export const deleteRestaurant = async (id: string) => {
  try {
    await Restaurant.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    throw new AppError(500, "Failed to delete restaurant");
  }

  return;
};
