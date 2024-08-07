import { Card, Text, Flex, Badge, Heading } from "@radix-ui/themes";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { GetAllRestaurantsResponse } from "../../types/Restaurant";
import { Link } from "react-router-dom";

function RestaurantCard({
  restaurant,
}: {
  restaurant: GetAllRestaurantsResponse;
}) {
  const { _id, images, name, cuisine, averageRating } = restaurant;

  const headImage = images[0];

  return (
    <Link
      to={`/restaurant/${_id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Card style={{ cursor: "pointer" }}>
        <img
          src={headImage}
          alt={name}
          style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }}
        />
        <Flex direction="column" gap="2" mt="2">
          <Heading as="h3" size="5" weight="bold">
            {name}
          </Heading>
          <Badge>{cuisine}</Badge>
          <Flex align="center" gap="1">
            {averageRating ? (
              <>
                <StarFilledIcon />
                <Text>{averageRating.toFixed(1)}/5</Text>
              </>
            ) : (
              <Text>No Reviews Yet</Text>
            )}
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
}

export default RestaurantCard;
