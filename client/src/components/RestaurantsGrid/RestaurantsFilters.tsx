import React from "react";
import { Flex, Select } from "@radix-ui/themes";

interface Filters {
  cuisine: string;
  priceRange: number[];
  reviewRange: number[];
}

interface RestaurantsFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  availableCuisines: string[];
}

const priceRangeOptions = [
  { label: "All Prices", value: "0-Infinity" },
  { label: "$", value: "1-1" },
  { label: "$$", value: "2-2" },
  { label: "$$$", value: "3-3" },
  { label: "$$$$", value: "4-4" },
  { label: "$$$$$", value: "5-5" },
];

const reviewRangeOptions = [
  { label: "Any number of reviews", value: "0-Infinity" },
  { label: "1-10 reviews", value: "1-10" },
  { label: "11-50 reviews", value: "11-50" },
  { label: "51-100 reviews", value: "51-100" },
  { label: "101+ reviews", value: "101-Infinity" },
];

const RestaurantsFilters: React.FC<RestaurantsFiltersProps> = ({
  filters,
  setFilters,
  availableCuisines,
}) => {
  const handleCuisineChange = (value: string) => {
    setFilters({ ...filters, cuisine: value === "All Cuisines" ? "" : value });
  };

  const handlePriceRangeChange = (value: string) => {
    const [min, max] = value.split("-").map(Number);
    setFilters({ ...filters, priceRange: [min, max] });
  };

  const handleReviewRangeChange = (value: string) => {
    const [min, max] = value
      .split("-")
      .map((v) => (v === "Infinity" ? Infinity : Number(v)));
    setFilters({ ...filters, reviewRange: [min, max] });
  };

  const getPriceRangeValue = () => {
    const [min, max] = filters.priceRange;
    return `${min}-${max === Infinity ? "Infinity" : max}`;
  };

  const getReviewRangeValue = () => {
    const [min, max] = filters.reviewRange;
    return `${min}-${max === Infinity ? "Infinity" : max}`;
  };

  return (
    <Flex gap="2" wrap="wrap">
      <Select.Root
        value={filters.cuisine || "All Cuisines"}
        onValueChange={handleCuisineChange}
      >
        <Select.Trigger placeholder="Cuisine" />
        <Select.Content>
          {availableCuisines.map((c) => (
            <Select.Item key={c} value={c}>
              {c}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Select.Root
        value={getPriceRangeValue()}
        onValueChange={handlePriceRangeChange}
      >
        <Select.Trigger placeholder="Price Range" />
        <Select.Content>
          {priceRangeOptions.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Select.Root
        value={getReviewRangeValue()}
        onValueChange={handleReviewRangeChange}
      >
        <Select.Trigger placeholder="Number of Reviews" />
        <Select.Content>
          {reviewRangeOptions.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};

export default RestaurantsFilters;
