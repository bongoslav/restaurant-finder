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

const router = express();

router.get("/api/v1/restaurants", getAllRestaurantsWithReviews);
router.get("/api/v1/restaurants/:id", getRestaurantWithReviews);
router.post("/api/v1/restaurants/add-restaurant", createRestaurant);
router.patch("/api/v1/restaurants/:id", updateRestaurant);
router.delete("/api/v1/restaurants/:id", deleteRestaurant);

router.post("/api/v1/restaurants/:id/add-photo",
  uploadRestaurantPhoto.single('restaurant-photo'),
  addCoverPhotoToRestaurant);
router.get("/api/v1/restaurants/:id/get-photos", getRestaurantPhotos);

export default router;
