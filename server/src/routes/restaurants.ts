import express from "express";
import {
  addReview,
  createRestaurant,
  deleteRestaurant,
  getAllRestaurants,
  getRestaurant,
  updateRestaurant,
} from "../controllers/restaurants";
const router = express();

router.get("/api/v1/restaurants", getAllRestaurants);
router.get("/api/v1/restaurants/:id", getRestaurant);
router.post("/api/v1/restaurants/add-restaurant", createRestaurant);
router.put("/api/v1/restaurants/:id", updateRestaurant);
router.delete("/api/v1/restaurants/:id", deleteRestaurant);
router.post("/api/v1/restaurants/:id/add-review", addReview);
router.get("/api/v1/restaurants/:id", getRestaurant)

export default router;
