import express from "express";
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurants";
import { isLoggedIn } from "../middlewares/auth";
import { isOwner } from "../middlewares/owner";

const router = express();

router.get("/", isLoggedIn, getAllRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", isLoggedIn, createRestaurant);
router.put("/:id", isLoggedIn, isOwner, updateRestaurant);
router.delete("/:id", isLoggedIn, isOwner, deleteRestaurant);

export default router;
