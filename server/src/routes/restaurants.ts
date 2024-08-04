import express from "express";
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurants";
import { isLoggedIn } from "../middlewares/auth";
import { isRestaurantOwner } from "../middlewares/isRestaurantOwner";
import { validateRequest } from "../middlewares/validateRequest";
import { createRestaurantSchema } from "../validations/schemas";

const router = express();

router.get("/", isLoggedIn, getAllRestaurants);
router.get("/:id", getRestaurantById);
router.post(
  "/",
  isLoggedIn,
  validateRequest(createRestaurantSchema),
  createRestaurant
);
router.put("/:id", isLoggedIn, isRestaurantOwner, updateRestaurant);
router.delete("/:id", isLoggedIn, isRestaurantOwner, deleteRestaurant);

export default router;
