import express from "express";
import { getAllRestaurants } from "../controllers/restaurants";
// import uploadRestaurantPhoto from "../middlewares/uploadRestaurantPhoto";
// import { isLoggedIn } from "../middlewares/loggedIn";
// import { isOwner } from "../middlewares/owner";

const router = express();

router.get("/restaurants", getAllRestaurants);
// router.get("/restaurants/:id", getRestaurantWithReviews);
// router.post("/restaurants/add-restaurant", isLoggedIn, isOwner, createRestaurant);
// router.patch("/restaurants/:id", isLoggedIn, isOwner, updateRestaurant);
// router.delete("/restaurants/:id", isLoggedIn, isOwner, deleteRestaurant);

// router.post("/api/v1/restaurants/:id/add-photo",
//   isLoggedIn,
//   uploadRestaurantPhoto.single('restaurant-photo'),
//   addCoverPhotoToRestaurant);
// router.get("/api/v1/restaurants/:id/get-photos", getRestaurantPhotos);

export default router;
