import express from "express";
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurants";
// import uploadRestaurantPhoto from "../middlewares/uploadRestaurantPhoto";
// import { isLoggedIn } from "../middlewares/loggedIn";
// import { isOwner } from "../middlewares/owner";

const router = express();

router.get("/restaurants", getAllRestaurants);
router.get("/restaurants/:id", getRestaurantById);
router.post("/restaurants", createRestaurant);
router.put("/restaurants/:id", updateRestaurant);
router.delete("/restaurants/:id", deleteRestaurant);

export default router;
