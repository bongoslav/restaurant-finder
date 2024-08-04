import express from "express";
import {
  addReview,
  deleteReview,
  getAllReviewsForRestaurant,
  getReviewForRestaurant,
} from "../controllers/reviews";
import { isLoggedIn } from "../middlewares/auth";
import { isReviewAuthor } from "../middlewares/isReviewAuthor";
import { validateRequest } from "../middlewares/validateRequest";
import { addReviewSchema } from "../validations/schemas";

const router = express();

router.get("/:restaurantId/reviews", getAllReviewsForRestaurant);
router.post(
  "/:restaurantId/reviews",
  isLoggedIn,
  validateRequest(addReviewSchema),
  addReview
);
router.get(
  "/:restaurantId/reviews/:reviewId",
  isLoggedIn,
  getReviewForRestaurant
);
router.delete(
  "/:restaurantId/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  deleteReview
);

export default router;
