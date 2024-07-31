import { useParams } from "react-router-dom";
import {
  Container,
  Heading,
  Text,
  Flex,
  Button,
  Box,
  Badge,
  Separator,
} from "@radix-ui/themes";
import {
  StarFilledIcon,
  Share1Icon,
  BookmarkIcon,
} from "@radix-ui/react-icons";
import { restaurants } from "../data";

const RestaurantDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const restaurant = restaurants.find((r) => r.id === Number(id));

  let openHours: string;
  const [openingHour, closingHour] = restaurant!.hours;
  if (openingHour === "0" && closingHour === "24") {
    openHours = "Open 24 hours";
  } else {
    openHours = restaurant!.hours.join("-");
  }

  if (!restaurant) {
    return <Text>Restaurant not found</Text>;
  }

  return (
    <Container size="4">
      <Flex direction="column" gap="4">
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
            src={restaurant.images[0]}
            alt={restaurant.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        <Flex justify="between" align="center">
          <Heading size="8">{restaurant.name}</Heading>
          <Flex gap="2">
            <Button variant="soft">
              <Share1Icon />
              Share
            </Button>
            <Button variant="soft">
              <BookmarkIcon />
              Save
            </Button>
          </Flex>
        </Flex>

        <Flex gap="2" align="center">
          <StarFilledIcon />
          <Text weight="bold">
            {restaurant.reviews.length > 0
              ? (
                  restaurant.reviews.reduce(
                    (acc, review) => acc + review.rating,
                    0
                  ) / restaurant.reviews.length
                ).toFixed(1)
              : "No reviews yet"}
          </Text>
          <Text>({restaurant.reviews.length} reviews)</Text>
          <Separator orientation="vertical" />
          <Badge>{restaurant.cuisine}</Badge>
          <Separator orientation="vertical" />
          <Text>{"$".repeat(restaurant.priceRange)}</Text>
        </Flex>

        <Box>
          <Heading size="6">Location</Heading>
          <Text>{restaurant.location}</Text>
        </Box>

        <Box>
          <Heading size="6">Hours</Heading>
          <Text>{openHours}</Text>
        </Box>

        <Box>
          <Heading size="6">Reviews</Heading>
          {restaurant.reviews.map((review) => (
            <Box key={review.id} mb="3">
              <Flex gap="2" align="center">
                <StarFilledIcon />
                <Text weight="bold">{review.rating}</Text>
                <Text>{review.title}</Text>
              </Flex>
              <Text>{review.text}</Text>
            </Box>
          ))}
        </Box>
      </Flex>
    </Container>
  );
};

export default RestaurantDetailsPage;
