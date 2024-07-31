import { useState, useEffect, useMemo } from "react";
import { Flex, Grid } from "@radix-ui/themes";
import RestaurantCard from "../RestaurantCard";
import { restaurants } from "../../data";
import RestaurantsFilters from "./RestaurantsFilters";
import PagesControls from "./PagesControls";

const RESTAURANTS_PER_PAGE = 8;

const RestaurantGrid = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([]);
  const [reviewRange, setReviewRange] = useState<number[]>([]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesSearch = restaurant.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCuisine =
        cuisine === "" ||
        cuisine === "All Cuisines" ||
        restaurant.cuisine === cuisine;
      const matchesPriceRange =
        priceRange.length === 0 ||
        (restaurant.priceRange >= priceRange[0] &&
          restaurant.priceRange <= priceRange[1]);
      const matchesReviewRange =
        reviewRange.length === 0 ||
        (restaurant.reviews.length >= reviewRange[0] &&
          restaurant.reviews.length <= reviewRange[1]);

      return (
        matchesSearch &&
        matchesCuisine &&
        matchesPriceRange &&
        matchesReviewRange
      );
    });
  }, [searchTerm, cuisine, priceRange, reviewRange]);

  const totalPages = Math.ceil(
    filteredRestaurants.length / RESTAURANTS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * RESTAURANTS_PER_PAGE;
  const endIndex = startIndex + RESTAURANTS_PER_PAGE;
  const currentRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, cuisine, priceRange, reviewRange]);

  return (
    <Flex direction="column" gap="6">
      <RestaurantsFilters
        setSearchTerm={setSearchTerm}
        cuisine={cuisine}
        setCuisine={setCuisine}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        reviewRange={reviewRange}
        setReviewRange={setReviewRange}
      />
      <Grid columns={{ initial: "2", sm: "3", md: "4" }} gap="4">
        {currentRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </Grid>
      <PagesControls
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </Flex>
  );
};

export default RestaurantGrid;
