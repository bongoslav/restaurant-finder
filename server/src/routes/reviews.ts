import express from "express";
import {
  addReview,
  deleteReview,
  getAllReviewsForRestaurant,
  getReviewForRestaurant,
} from "../controllers/reviews";

const router = express();

router.get("/:restaurantId/reviews", getAllReviewsForRestaurant);
router.post("/:restaurantId/reviews", addReview);
router.get("/:restaurantId/reviews/:reviewId", getReviewForRestaurant);
router.delete("/:restaurantId/reviews/:reviewId", deleteReview);
// router.post("/:reviewId/helpful", markReviewAsHelpful);

export default router;
