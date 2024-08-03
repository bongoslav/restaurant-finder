import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import * as restaurantService from "../services/restaurantService";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_RESTAURANTS_PER_PAGE = 8;

export const getAllRestaurants = async (req: Request, res: Response) => {
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
    console.error("Error in getAllRestaurants:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching restaurants",
    });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await restaurantService.getRestaurantById(id);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Invalid restaurant ID") {
        console.error("Error in getRestaurantById:", error);
        res.status(400).json({
          status: "error",
          message: error.message,
        });
      } else if (error.message === "Restaurant not found") {
        console.error("Error in getRestaurantById:", error);
        res.status(404).json({
          status: "error",
          message: error.message,
        });
      }
    } else {
      console.error("Error in getRestaurantById:", error);
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
};

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const { name, location, priceRange, cuisine } = req.body;

    const result = await restaurantService.createRestaurant(
      name,
      location,
      priceRange,
      cuisine
    );

    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error("Error in createRestaurant:", error);
    if (error instanceof Error && error.message === "Missing required fields") {
      res.status(400).json({
        status: "error",
        message: "Missing required fields",
      });
    } else {
      console.error("Error in createRestaurant:", error);
      res.status(500).json({
        status: "error",
        message: "An error occurred while creating the restaurant",
      });
    }
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const body: restaurantService.UpdateRestaurantBody = req.body;
    const updatedRestaurant = await restaurantService.updateRestaurant(
      id,
      body
    );

    if (!updatedRestaurant) {
      return res.status(404).json({
        status: "error",
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: updatedRestaurant,
    });
  } catch (error) {
    console.error("Error in updateRestaurant:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while updating the restaurant",
    });
  }
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const isDeleted = await restaurantService.deleteRestaurant(id);

    if (!isDeleted) {
      return res.status(404).json({
        status: "error",
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Restaurant successfully deleted",
    });
  } catch (error) {
    console.error("Error in deleteRestaurant:", error);
    if (error instanceof Error && error.message === "Invalid restaurant ID") {
      return res.status(400).json({
        status: "error",
        message: "Invalid restaurant ID",
      });
    }
    res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the restaurant",
    });
  }
};
