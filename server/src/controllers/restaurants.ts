import { NextFunction, Request, Response } from "express";
import * as restaurantService from "../services/restaurantService";
import { AuthRequest } from "../types/AuthRequest";

const MAX_RESTAURANTS_PER_PAGE = 8;

export const getAllRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      100,
      Math.max(
        1,
        parseInt(req.query.limit as string) || MAX_RESTAURANTS_PER_PAGE
      )
    );
    const sortBy = ["name", "priceRange", "createdAt"].includes(
      req.query.sortBy as string
    )
      ? (req.query.sortBy as string)
      : "createdAt";
    const sortOrder: "asc" | "desc" =
      req.query.sortOrder === "asc" ? "asc" : "desc";

    const options = {
      page,
      limit,
      sortBy,
      sortOrder,
      cuisine: req.query.cuisine as string | undefined,
      minPrice: req.query.minPrice
        ? parseInt(req.query.minPrice as string)
        : undefined,
      maxPrice: req.query.maxPrice
        ? parseInt(req.query.maxPrice as string)
        : undefined,
    };

    const result = await restaurantService.getAllRestaurants(options);

    res.status(200).json({
      status: "success",
      data: result.restaurants,
      pagination: {
        currentPage: page,
        totalPages: result.totalPages,
        totalRestaurants: result.totalRestaurants,
        hasNextPage: page < result.totalPages,
      },
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
