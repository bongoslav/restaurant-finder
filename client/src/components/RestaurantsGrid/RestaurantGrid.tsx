import { Grid } from "@radix-ui/themes";
import RestaurantCard from "./RestaurantCard";
import { GetAllRestaurantsResponse } from "../../types/Restaurant";

export interface RestaurantGridProps {
  restaurants: GetAllRestaurantsResponse[];
}

const RestaurantGrid = ({ restaurants }: RestaurantGridProps) => {
  return (
    <Grid columns={{ initial: "2", sm: "3", md: "4" }} gap="4">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
      ))}
    </Grid>
  );
};

export default RestaurantGrid;
