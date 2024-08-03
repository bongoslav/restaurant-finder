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

router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", createRestaurant);
router.put("/:id", updateRestaurant);
router.delete("/:id", deleteRestaurant);

export default router;
