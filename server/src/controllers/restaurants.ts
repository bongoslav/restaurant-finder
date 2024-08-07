import { NextFunction, Request, Response } from "express";
import * as restaurantService from "../services/restaurantService";
import { AuthRequest } from "../types/AuthRequest";

const MAX_RESTAURANTS_PER_PAGE = 8;

export interface GetAllRestaurantsQueryParams {
  page?: string;
  search?: string;
  cuisine?: string;
  minPrice?: string;
  maxPrice?: string;
  minReviews?: string;
  maxReviews?: string;
  sortBy?: string;
  sortOrder?: string;
}

// TODO: adjust test
export const getAllRestaurants = async (
  req: Request<object, object, object, GetAllRestaurantsQueryParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    // query params are received as strings
    // so we need to do parsing in our service
    const {
      page = "1",
      search = "",
      cuisine = "",
      minPrice = "0",
      maxPrice = Infinity.toString(),
      minReviews = "0",
      maxReviews = Infinity.toString(),
      sortBy = "createdAt",
      sortOrder = "asc",
    } = req.query;

    const limit = MAX_RESTAURANTS_PER_PAGE.toString();

    const options = {
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
    };

    const result = await restaurantService.getAllRestaurants(options);

    res.status(200).json({
      status: "success",
      data: result.restaurants,
      pagination: {
        currentPage: +page,
        totalPages: result.totalPages,
        totalRestaurants: result.totalRestaurants,
        hasNextPage: result.hasNextPage,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCuisines = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cuisines = await restaurantService.getAllCuisines();

    res.status(200).json({
      status: "success",
      data: cuisines,
    });
  } catch (error) {
    next(error);
  }
};

export const getRestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const result = await restaurantService.getRestaurantById(id);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createRestaurant = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, location, priceRange, cuisine, hours } = req.body;
    const userId = req.user.userId;

    const result = await restaurantService.createRestaurant(
      name,
      location,
      priceRange,
      cuisine,
      userId,
      hours
    );

    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRestaurant = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const body: restaurantService.UpdateRestaurantBody = req.body;
    const updatedRestaurant = await restaurantService.updateRestaurant(
      id,
      body
    );

    res.status(200).json({
      status: "success",
      data: updatedRestaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRestaurant = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await restaurantService.deleteRestaurant(id);

    res.status(200).json({
      status: "success",
      message: "Restaurant successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};
