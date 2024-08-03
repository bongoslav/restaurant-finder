import mongoose, { Types } from "mongoose";

interface IReview {
  _id?: Types.ObjectId;
  title: string;
  userId: Types.ObjectId;
  rating: number;
  text: string;
}

interface IRestaurant {
  _id?: Types.ObjectId;
  name: string;
  location: string;
  priceRange: number;
  images: string[];
  hours: string[];
  cuisine: string;
  reviews: IReview[];
}

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
  },
  { timestamps: true }
);

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    priceRange: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.every((url: string) => /^https?:\/\/.+\..+/.test(url));
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid URL!`,
      },
    },
    hours: {
      type: [String],
      trim: true,
    },
    cuisine: {
      type: String,
      required: true,
      trim: true,
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

// fields that are frequently filtered by
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ priceRange: 1 });
restaurantSchema.index({ "reviews.rating": 1 });

const Restaurant = mongoose.model<IRestaurant>("Restaurant", restaurantSchema);

export default Restaurant;
