import React, { useMemo } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Flex, Select, TextField } from "@radix-ui/themes";
import debounce from "lodash/debounce";
import { restaurants } from "../../data";

const priceRanges = [
  { label: "All", value: "all" },
  { label: "$", value: "1-1" },
  { label: "$$", value: "2-2" },
  { label: "$$$", value: "3-3" },
  { label: "$$$$", value: "4-4" },
  { label: "$-$$", value: "1-2" },
  { label: "$$-$$$", value: "2-3" },
  { label: "$$$-$$$$", value: "3-4" },
];

const reviewRanges = [
  { label: "All", value: "all" },
  { label: "<5", value: "0-4" },
  { label: "6-10", value: "6-10" },
  { label: "11-20", value: "11-20" },
  { label: ">20", value: "21-Infinity" },
];

interface RestaurantsFiltersProps {
  setSearchTerm: (value: string) => void;
  cuisine: string;
  setCuisine: (value: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  reviewRange: number[];
  setReviewRange: (value: number[]) => void;
}

const RestaurantsFilters = ({
  setSearchTerm,
  cuisine,
  setCuisine,
  priceRange,
  setPriceRange,
  reviewRange,
  setReviewRange,
}: RestaurantsFiltersProps) => {
  const uniqueCuisines = useMemo(
    () => ["All Cuisines", ...new Set(restaurants.map((r) => r.cuisine))],
    []
  );

  // lodash is highly optimized
  // if no `useMemo` -> the debounce function will be recreated on every rerender
  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    [setSearchTerm]
  );

  const handlePriceRangeChange = (value: string) => {
    if (value === "all") {
      setPriceRange([]);
    } else {
      setPriceRange(value.split("-").map(Number));
    }
  };

  const handleReviewRangeChange = (value: string) => {
    if (value === "all") {
      setReviewRange([]);
    } else {
      setReviewRange(
        value.split("-").map((v) => (v === "Infinity" ? Infinity : Number(v)))
      );
    }
  };

  return (
    <Flex gap="2" wrap="wrap">
      <TextField.Root
        style={{ flexGrow: 1, minWidth: "200px" }}
        placeholder="Search for a restaurant..."
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          debouncedSearch(e.target.value)
        }
      >
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
      <Select.Root value={cuisine} onValueChange={setCuisine}>
        <Select.Trigger placeholder="Cuisine" />
        <Select.Content>
          {uniqueCuisines.map((c) => (
            <Select.Item key={c} value={c}>
              {c}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Select.Root
        value={priceRange.length ? `${priceRange[0]}-${priceRange[1]}` : "all"}
        onValueChange={handlePriceRangeChange}
      >
        <Select.Trigger placeholder="Price Range" />
        <Select.Content>
          {priceRanges.map((range) => (
            <Select.Item key={range.label} value={range.value}>
              {range.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Select.Root
        value={
          reviewRange.length ? `${reviewRange[0]}-${reviewRange[1]}` : "all"
        }
        onValueChange={handleReviewRangeChange}
      >
        <Select.Trigger placeholder="Number of Reviews" />
        <Select.Content>
          {reviewRanges.map((range) => (
            <Select.Item key={range.label} value={range.value}>
              {range.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};

export default RestaurantsFilters;
