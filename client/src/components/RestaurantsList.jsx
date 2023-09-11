import { useContext, useEffect } from "react";
import restaurantFinder from "../api/restaurantFinder";
import { RestaurantsContext } from "../context/restaurantsContext";
import RestaurantCard from "./RestaurantCard";

function RestaurantsList() {
  const { restaurants, setRestaurants } = useContext(RestaurantsContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await restaurantFinder.get("/");
        setRestaurants(response.data.data.restaurants);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-content mih-h-screen container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-2 gap-4">
        {restaurants &&
          restaurants.map((restaurant) => {
            return (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            );
          })}
      </div>
    </div>
  );
}

export default RestaurantsList;
