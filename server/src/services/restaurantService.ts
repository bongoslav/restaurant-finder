import { FilterQuery, Types, PipelineStage } from "mongoose";
import Restaurant from "../models/restaurant.model";
import IRestaurant from "../types/Restaurant";

interface GetAllRestaurantsOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  cuisine?: string;
  minPrice?: number;
  maxPrice?: number;
}

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

export const getAllRestaurants = async (options: GetAllRestaurantsOptions) => {
  const { page, limit, sortBy, sortOrder, cuisine, minPrice, maxPrice } =
    options;

  const matchStage: FilterQuery<IRestaurant> = {};
  if (cuisine) matchStage.cuisine = cuisine;
  if (minPrice !== undefined || maxPrice !== undefined) {
    matchStage.priceRange = {};
    if (minPrice !== undefined) matchStage.priceRange.$gte = minPrice;
    if (maxPrice !== undefined) matchStage.priceRange.$lte = maxPrice;
  }

  const aggregationPipeline: PipelineStage[] = [
    { $match: matchStage },
    {
      $addFields: {
        reviewCount: { $size: "$reviews" },
        averageRating: {
          $cond: [
            { $gt: [{ $size: "$reviews" }, 0] },
            { $avg: "$reviews.rating" },
            0,
          ],
        },
      },
    },
    {
      $project: {
        name: 1,
        location: 1,
        priceRange: 1,
        cuisine: 1,
        ownerId: 1,
        images: 1,
        reviewCount: 1,
        averageRating: { $round: ["$averageRating", 1] },
      },
    },
    { $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];

  const restaurants = await Restaurant.aggregate<AggregatedRestaurant>(
    aggregationPipeline
  );

  const total = await Restaurant.countDocuments(matchStage);

  return {
    restaurants,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    totalRestaurants: total,
  };
};

export const getRestaurantById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid restaurant ID");
  }

  const aggregationPipeline: PipelineStage[] = [
    { $match: { _id: new Types.ObjectId(id) } },
    {
      $addFields: {
        reviewCount: { $size: "$reviews" },
        averageRating: {
          $cond: [
            { $gt: [{ $size: "$reviews" }, 0] },
            { $avg: "$reviews.rating" },
            0,
          ],
        },
      },
    },
    {
      $project: {
        name: 1,
        location: 1,
        priceRange: 1,
        cuisine: 1,
        ownerId: 1,
        images: 1,
        reviewCount: 1,
        averageRating: { $round: ["$averageRating", 1] },
      },
    },
  ];

  const restaurant = await Restaurant.aggregate(aggregationPipeline);

  if (restaurant.length === 0) {
    throw new Error("Restaurant not found");
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
  if (!name || !location || !priceRange || !cuisine) {
    throw new Error("Missing required fields");
  }

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
    throw new Error("Failed to create restaurant");
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

    if (!updatedRestaurant) {
      return null;
    }

    return {
      _id: updatedRestaurant._id,
      ...updateFields,
    };
  } catch (error) {
    console.error("Error updating restaurant:", error);
    throw new Error("Failed to update restaurant");
  }
};

export const deleteRestaurant = async (id: string): Promise<boolean> => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid restaurant ID");
    }

    const result = await Restaurant.findByIdAndDelete(id);

    if (!result) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    throw new Error("Failed to delete restaurant");
  }
};
