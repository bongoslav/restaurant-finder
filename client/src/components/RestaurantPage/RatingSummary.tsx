import { Flex, Text, Separator, Badge } from "@radix-ui/themes";
import { StarFilledIcon } from "@radix-ui/react-icons";
import Review from "../../types/Review";

interface RatingSummaryProps {
  reviews: Review[];
  cuisine: string;
  priceRange: number;
}

const RatingSummary = ({
  reviews,
  cuisine,
  priceRange,
}: RatingSummaryProps) => (
  <Flex gap="2" align="center">
    <StarFilledIcon />
    <Text weight="bold">
      {reviews.length > 0
        ? (
            reviews.reduce((acc, review) => acc + review.rating, 0) /
            reviews.length
          ).toFixed(1)
        : "No reviews yet"}
    </Text>
    <Text>({reviews.length} reviews)</Text>
    <Separator orientation="vertical" />
    <Badge>{cuisine}</Badge>
    <Separator orientation="vertical" />
    <Text>{"$".repeat(priceRange)}</Text>
  </Flex>
);

export default RatingSummary;
