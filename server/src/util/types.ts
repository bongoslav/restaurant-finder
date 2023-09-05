export interface IRestaurant {
  id: number;
  name: string;
  location: string;
  price_range: number;
}

export interface IReview {
  id: number;
  restaurant_id: number;
  name: string;
  review: string;
  rating: number;
}

export interface RestaurantWithReviewStats extends IRestaurant {
  restaurant_id: number;
  review_count: number;
  average_rating: number;
}