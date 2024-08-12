import { useParams } from "react-router-dom";
import {
  Container,
  Heading,
  Text,
  Flex,
  Box,
  Badge,
  Separator,
  Skeleton,
} from "@radix-ui/themes";
import { StarFilledIcon } from "@radix-ui/react-icons";
import useSWR from "swr";
import fetcher from "../util/fetcher";
import { Restaurant } from "../types/Restaurant";
import WorkingHours from "../components/RestaurantPage/WorkingHours";
import API_URL from "../util/apiUrl";

interface RestaurantFetchResponse {
  status: string;
  data: Restaurant;
}

const RestaurantDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: restaurantResponse,
    error: restaurantFetchError,
    isLoading,
  } = useSWR<RestaurantFetchResponse>(
    `${API_URL}/api/v1/restaurants/${id}`,
    fetcher
  );

  if (!restaurantResponse) {
    return <Text>Restaurant not found</Text>;
  }

  if (restaurantFetchError) {
    return <Text>Could not fetch restaurants</Text>;
  }

  const {
    name,
    location,
    priceRange,
    images,
    hours,
    cuisine,
    reviewCount,
    reviews,
  } = restaurantResponse.data;

  return (
    <Container size="4">
      <Flex direction="column" gap="4">
        <Skeleton loading={isLoading}>
          <Box
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              aspectRatio: "3 / 1",
              width: "100%",
            }}
          >
            <img
              src={images[0]}
              alt={name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Skeleton>

        <Skeleton loading={isLoading}>
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
        </Skeleton>

        <Flex justify="between">
          <Box style={{ flex: 1 }}>
            <Skeleton loading={isLoading}>
              <Box>
                <Heading size="6">Location</Heading>
                <Text>{location}</Text>
              </Box>
            </Skeleton>

            <Box mt="4">
              <Skeleton loading={isLoading}>
                <Heading size="6">Reviews ({reviewCount})</Heading>
              </Skeleton>
              {reviews.map((review) => (
                <Skeleton loading={isLoading} key={review._id}>
                  <Box key={review._id} mb="3">
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
          </Box>

          <Box style={{ width: "200px", marginLeft: "20px" }}>
            <Skeleton loading={isLoading}>
              <WorkingHours hours={hours} />
            </Skeleton>
          </Box>
        </Flex>
      </Flex>
    </Container>
  );
};

export default RestaurantDetailsPage;
