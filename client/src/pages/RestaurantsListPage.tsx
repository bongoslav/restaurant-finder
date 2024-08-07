import { useState, useCallback, useEffect } from "react";
import useSWR from "swr";
import RestaurantGrid from "../components/RestaurantsGrid/RestaurantGrid";
import RestaurantsFilters from "../components/RestaurantsGrid/RestaurantsFilters";
import PagesControls from "../components/RestaurantsGrid/PagesControls";
import { GetAllRestaurantsResponse } from "../types/Restaurant";
import fetcher from "../util/fetcher";
import { Box, Flex } from "@radix-ui/themes";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface RestaurantsResponse {
  status: string;
  data: GetAllRestaurantsResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRestaurants: number;
    hasNextPage: boolean;
  };
}

interface CuisinesResponse {
  status: string;
  data: string[];
}

interface Filters {
  cuisine: string;
  priceRange: number[];
  reviewRange: number[];
}

const RestaurantListPage = () => {
  const [filters, setFilters] = useState<Filters>({
    cuisine: "",
    priceRange: [],
    reviewRange: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [allCuisines, setAllCuisines] = useState(["All Cuisines"]);

  const apiUrl = useCallback(() => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      minPrice: filters.priceRange[0]?.toString() || "0",
      maxPrice: filters.priceRange[1]?.toString() || "Infinity",
      minReviews: filters.reviewRange[0]?.toString() || "0",
      maxReviews: filters.reviewRange[1]?.toString() || "Infinity",
    });

    // to handle "All cuisines" selected
    if (filters.cuisine) {
      params.append("cuisine", filters.cuisine);
    }

    return `${API_URL}/api/v1/restaurants?${params.toString()}`;
  }, [currentPage, filters]);

  const {
    data: restaurantsResponse,
    error: restaurantsFetchError,
    isLoading,
  } = useSWR<RestaurantsResponse>(apiUrl, fetcher);

  const { data: cuisinesResponse, error: cuisinesFetchError } =
    useSWR<CuisinesResponse>(`${API_URL}/api/v1/restaurants/cuisines`, fetcher);

  useEffect(() => {
    if (cuisinesResponse && cuisinesResponse.data) {
      setAllCuisines(["All Cuisines", ...cuisinesResponse.data]);
    }
  }, [cuisinesResponse]);

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  if (restaurantsFetchError || cuisinesFetchError) {
    return <div>Failed to load data. Please try again later.</div>;
  }

  if (!restaurantsResponse || !cuisinesResponse) {
    return <div>Loading...</div>;
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Flex justify="center" mb="4">
        <Box width="100%" style={{ maxWidth: "800px" }}>
          <RestaurantsFilters
            filters={filters}
            setFilters={handleFiltersChange}
            availableCuisines={allCuisines}
          />
        </Box>
      </Flex>
      <RestaurantGrid restaurants={restaurantsResponse.data} />
      <PagesControls
        currentPage={restaurantsResponse.pagination.currentPage}
        totalPages={restaurantsResponse.pagination.totalPages}
        hasNextPage={restaurantsResponse.pagination.hasNextPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default RestaurantListPage;
