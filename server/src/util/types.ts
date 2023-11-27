import { IRestaurant } from "../models/restaurant.model";

export interface RestaurantWithReviewStats extends IRestaurant {
  restaurantId: number;
  reviewCount: number;
  averageRating: number;
}