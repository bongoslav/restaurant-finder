import { Card, Text, Flex, Badge, Heading } from "@radix-ui/themes";
import { StarFilledIcon } from "@radix-ui/react-icons";
import Restaurant from "../types/Restaurant";
import { Link } from "react-router-dom";

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const { id, images, reviews, name, cuisine } = restaurant;
  const headImage = images[0];

  const ratings = reviews.map((review) => review.rating);
  const totalRating = ratings.reduce((acc, rating) => acc + rating, 0);
  const avgRating = totalRating / ratings.length;

  return (
    <Link
      to={`/restaurant/${id}`}
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
            {reviews.length > 0 ? (
              <>
                <StarFilledIcon />
                <Text>{avgRating.toFixed(1)}/5</Text>
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
