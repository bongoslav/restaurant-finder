import { FilterQuery } from "mongoose";
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

export const getAllRestaurants = async (options: GetAllRestaurantsOptions) => {
  const { page, limit, sortBy, sortOrder, cuisine, minPrice, maxPrice } =
    options;

  const skip = (page - 1) * limit;

  const filter: FilterQuery<IRestaurant> = {};
  if (cuisine) {
    filter.cuisine = cuisine;
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.priceRange = {};
    if (minPrice !== undefined) filter.priceRange.$gte = minPrice;
    if (maxPrice !== undefined) filter.priceRange.$lte = maxPrice;
  }

  const sort: { [key: string]: "asc" | "desc" } = { [sortBy]: sortOrder };

  const restaurants = await Restaurant.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select("name location priceRange cuisine reviewSummary")
    .lean();
  
  // TODO: aggregate...get important reviews info

  const total = await Restaurant.countDocuments(filter);

  return {
    restaurants,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    totalRestaurants: total,
  };
};
