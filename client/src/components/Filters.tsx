import { Flex, Select } from "@radix-ui/themes";

// `Select.Item` value cannot be []
// thus a workaround is to use strings and split them
const priceRanges = [
  { label: "Price range", value: "all" },
  { label: "$", value: "1-1" },
  { label: "$$", value: "2-2" },
  { label: "$$$", value: "3-3" },
  { label: "$$$$", value: "4-4" },
  { label: "$-$$", value: "1-2" },
  { label: "$$-$$$", value: "2-3" },
  { label: "$$$-$$$$", value: "3-4" },
];

const reviewRanges = [
  { label: "Number of reviews", value: "all" },
  { label: "<5", value: "0-4" },
  { label: "6-10", value: "6-10" },
  { label: "11-20", value: "11-20" },
  { label: ">20", value: "21-Infinity" },
];

interface FiltersProps {
  cuisine: string;
  setCuisine: (cuisine: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  reviewRange: number[];
  setReviewRange: (range: number[]) => void;
  uniqueCuisines: string[];
}

const Filters = ({
  cuisine,
  setCuisine,
  priceRange,
  setPriceRange,
  reviewRange,
  setReviewRange,
  uniqueCuisines,
}: FiltersProps) => {
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
        value={
          priceRange.length ? `${priceRange[0]}-${priceRange[1]}` : "all"
        }
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

export default Filters;
