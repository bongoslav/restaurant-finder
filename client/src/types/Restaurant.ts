import Review from "./Review";

export default interface Restaurant {
  id: number;
  name: string;
  location: string;
  priceRange: number;
  images: string[];
  hours: string[];
  cuisine: string;
  reviews: Review[];
}
