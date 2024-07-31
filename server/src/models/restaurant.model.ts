import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    title: String,
    authorId: mongoose.Schema.ObjectId,
    rating: Number,
    text: String,
  },
  { timestamps: true }
);

const restaurantSchema = new mongoose.Schema(
  {
    name: String,
    location: String,
    priceRange: Number,
    images: [String],
    hours: [String],
    cuisine: String,
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
