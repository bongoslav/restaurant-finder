import express from "express";
import {
  addReview,
  deleteReview,
  getAllReviewsForRestaurant,
  getReviewForRestaurant,
} from "../controllers/reviews";
import { isLoggedIn } from "../middlewares/auth";

const router = express();

router.get("/:restaurantId/reviews", getAllReviewsForRestaurant);
router.post("/:restaurantId/reviews", isLoggedIn, addReview);
router.get(
  "/:restaurantId/reviews/:reviewId",
  isLoggedIn,
  getReviewForRestaurant
);
router.delete("/:restaurantId/reviews/:reviewId", isLoggedIn, deleteReview);

export default router;
