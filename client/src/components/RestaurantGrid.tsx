import { useState } from "react";
import { Box, Button, Flex, Grid, TextField, Text } from "@radix-ui/themes";
import RestaurantCard from "./RestaurantCard";
import { restaurants } from "../data";
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";

const RESTAURANTS_PER_PAGE = 8;

const RestaurantGrid = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(restaurants.length / RESTAURANTS_PER_PAGE);
  const startIndex = (currentPage - 1) * RESTAURANTS_PER_PAGE;
  const endIndex = startIndex + RESTAURANTS_PER_PAGE;
  const currentRestaurants = restaurants.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <Flex direction="column" gap="6">
      <Box>
        <Flex justify="between" mb="4">
          <TextField.Root placeholder="Search for a restaurant...">
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
          <Button>Filters - to include cuisines, rating, price range</Button>
          <Button>Map View - zoom to the visible restaurants (filtered)</Button>
        </Flex>
        <Grid columns={{ initial: "2", sm: "3", md: "4" }} gap="4">
          {currentRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </Grid>
        <Flex justify="between" align="center" mt="4">
          <Button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            variant="soft"
          >
            <ChevronLeftIcon />
            Previous
          </Button>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            variant="soft"
          >
            Next
            <ChevronRightIcon />
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default RestaurantGrid;
