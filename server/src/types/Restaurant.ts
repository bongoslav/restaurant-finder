import IReview from "./Review";

export default interface IRestaurant {
  id: string;
  name: string;
  location: string;
  priceRange: number;
  images: string[];
  hours: string[];
  cuisine: string;
  reviews: IReview[];
}
