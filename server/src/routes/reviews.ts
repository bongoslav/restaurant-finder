import express from "express";
import {
  addReview,
  getAllReviewsForRestaurant,
  getReviewForRestaurant,
} from "../controllers/reviews";

const router = express();

router.get("/:restaurantId/reviews", getAllReviewsForRestaurant);
router.post("/:restaurantId/reviews", addReview);
router.get("/:restaurantId/reviews/:reviewId", getReviewForRestaurant);
// router.put("/:restaurantId/reviews/:reviewId", updateReview);
// router.delete("/:restaurantId/reviews/:id", deleteReview);
// router.post("/:restaurantId/reviews/:reviewId/helpful", markReviewAsHelpful);

export default router;
