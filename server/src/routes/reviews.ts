import express from "express";
import {
  addReview,
  deleteReview,
  editReview,
  getAllReviews,
  getReview
} from "../controllers/reviews";

const router = express()

router.get("/api/v1/reviews", getAllReviews);
router.get("/api/v1/reviews/:id", getReview)
router.post("/api/v1/restaurants/:id/add-review", addReview);
router.patch("/api/v1/reviews/:id", editReview)
router.delete("/api/v1/reviews/:id", deleteReview)