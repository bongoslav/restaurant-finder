import { FilterQuery, Types, PipelineStage } from "mongoose";
import Restaurant, { IRestaurant } from "../models/restaurant.model";
import { AppError } from "../utils/errorHandler";

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
      // $facet improves reading time
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          {
            $project: {
              name: 1,
              location: 1,
              priceRange: 1,
              cuisine: 1,
              ownerId: 1,
              images: 1,
              reviewCount: 1,
              averageRating: 1,
            },
          },
          { $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ],
      },
    },
  ];

  const [result] = await Restaurant.aggregate(aggregationPipeline);

  const restaurants = result.data;
  const totalRestaurants = result.metadata[0]?.total || 0;

  // const restaurants = await Restaurant.aggregate<AggregatedRestaurant>(
  //   aggregationPipeline
  // );

  // const total = await Restaurant.countDocuments(matchStage);

  return {
    restaurants,
    page,
    limit,
    totalPages: Math.ceil(totalRestaurants / limit),
    totalRestaurants,
  };
};

export const getRestaurantById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid restaurant ID");
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
