import { useParams } from "react-router-dom";
import { Container, Text, Flex, Box, Skeleton, Button } from "@radix-ui/themes";
import useSWR from "swr";
import fetcher from "../util/fetcher";
import { Restaurant } from "../types/Restaurant";
import WorkingHours from "../components/RestaurantPage/WorkingHours";
import API_URL from "../util/apiUrl";
import { useAuth } from "../hooks/useAuth";
import AddReviewForm from "../components/RestaurantPage/AddReviewForm";
import RestaurantImage from "../components/RestaurantPage/RestaurantImage";
import RatingSummary from "../components/RestaurantPage/RatingSummary";
import LocationInfo from "../components/RestaurantPage/LocationInfo";
import ReviewsList from "../components/RestaurantPage/ReviewList";
import EditRestaurantDialog from "../components/RestaurantPage/EditRestaurantDialog";

interface RestaurantFetchResponse {
  status: string;
  data: Restaurant;
}

const RestaurantDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();

  const {
    data: restaurantResponse,
    error: restaurantFetchError,
    isLoading,
    mutate,
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

  const restaurant = restaurantResponse.data;
  const isOwner = user && user.id === restaurant.ownerId;

  const handleReviewAdded = () => {
    mutate(); // refetch the restaurant data, including the new review
  };

  const handleRestaurantUpdated = () => {
    mutate();
  };

  return (
    <Container size="4">
      <Flex direction="column" gap="4">
        <Skeleton loading={isLoading}>
          <RestaurantImage image={images[0]} name={name} />
        </Skeleton>

        <Skeleton loading={isLoading}>
          <Flex justify="between" align="center">
            <RatingSummary
              reviews={reviews}
              cuisine={cuisine}
              priceRange={priceRange}
            />
            {isOwner && (
              <EditRestaurantDialog
                restaurant={restaurant}
                onRestaurantUpdated={handleRestaurantUpdated}
              >
                <Button style={{ cursor: "pointer" }}>Edit Restaurant</Button>
              </EditRestaurantDialog>
            )}
          </Flex>
        </Skeleton>

        <Flex justify="between">
          <Box style={{ flex: 1 }}>
            <Skeleton loading={isLoading}>
              <LocationInfo location={location} />
            </Skeleton>

            <Box mt="4">
              <Skeleton loading={isLoading}>
                <ReviewsList
                  reviews={reviews}
                  reviewCount={reviewCount}
                  isLoading={isLoading}
                />
              </Skeleton>
              {isAuthenticated && (
                <Box mt="4">
                  <AddReviewForm
                    restaurantId={id!}
                    onReviewAdded={handleReviewAdded}
                  />
                </Box>
              )}
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
