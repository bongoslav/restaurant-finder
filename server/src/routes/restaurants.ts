import express from "express";
import {
  addCoverPhotoToRestaurant,
  addReview,
  createRestaurant,
  deleteRestaurant,
  getAllRestaurants,
  getRestaurant,
  updateRestaurant,
} from "../controllers/restaurants";
import uploadRestaurantPhoto from "../middlewares/uploadRestaurantPhoto";

const router = express();

router.get("/api/v1/restaurants", getAllRestaurants);
router.get("/api/v1/restaurants/:id", getRestaurant);
router.post("/api/v1/restaurants/add-restaurant", createRestaurant);
router.post("/api/v1/restaurants/:id/add-photo", uploadRestaurantPhoto.single('restaurant-photo'), addCoverPhotoToRestaurant)
router.put("/api/v1/restaurants/:id", updateRestaurant);
router.delete("/api/v1/restaurants/:id", deleteRestaurant);
router.post("/api/v1/restaurants/:id/add-review", addReview);
router.get("/api/v1/restaurants/:id", getRestaurant)

export default router;
