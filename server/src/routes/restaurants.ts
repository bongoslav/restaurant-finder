import express from "express";
import {
  addCoverPhotoToRestaurant,
  createRestaurant,
  deleteRestaurant,
  getAllRestaurantsWithReviews,
  getRestaurantWithReviews,
  getRestaurantPhotos,
  updateRestaurant,
} from "../controllers/restaurants";
import uploadRestaurantPhoto from "../middlewares/uploadRestaurantPhoto";
import { isLoggedIn } from "../middlewares/loggedIn";
import { isOwner } from "../middlewares/owner";

const router = express();

router.get("/api/v1/restaurants", getAllRestaurantsWithReviews);
router.get("/api/v1/restaurants/:id", getRestaurantWithReviews);
router.post("/api/v1/restaurants/add-restaurant", isLoggedIn, isOwner, createRestaurant);
router.patch("/api/v1/restaurants/:id", isLoggedIn, isOwner, updateRestaurant);
router.delete("/api/v1/restaurants/:id", isLoggedIn, isOwner, deleteRestaurant);

router.post("/api/v1/restaurants/:id/add-photo",
  isLoggedIn,
  uploadRestaurantPhoto.single('restaurant-photo'),
  addCoverPhotoToRestaurant);
router.get("/api/v1/restaurants/:id/get-photos", getRestaurantPhotos);

export default router;
