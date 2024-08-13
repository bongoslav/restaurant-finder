import { Box, Flex, Text, Heading, Skeleton } from "@radix-ui/themes";
import { StarFilledIcon } from "@radix-ui/react-icons";
import Review from "../../types/Review";

interface ReviewsListProps {
  reviews: Review[];
  reviewCount: number;
  isLoading: boolean;
}

const ReviewsList = ({ reviews, reviewCount, isLoading }: ReviewsListProps) => (
  <Box>
    <Heading size="6">Reviews ({reviewCount})</Heading>
    {reviews.map((review) => (
      <Skeleton loading={isLoading} key={review._id}>
        <Box mb="3">
          <Flex gap="2" align="center">
            <StarFilledIcon />
            <Text weight="bold">
              {review.rating} - {review.title}
            </Text>
          </Flex>
          <Text>{review.text}</Text>
        </Box>
      </Skeleton>
    ))}
  </Box>
);

export default ReviewsList;
