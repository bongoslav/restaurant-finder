import Review from "./Review";

export interface Restaurant {
  _id: string;
  name: string;
  location: string;
  priceRange: number;
  images: string[];
  hours: string[];
  cuisine: string;
  ownerId: string;
  reviewCount: number;
  averageRating: number;
  reviews: Review[];
}

export type GetAllRestaurantsResponse = Omit<Restaurant, "reviews" | "hours">;
