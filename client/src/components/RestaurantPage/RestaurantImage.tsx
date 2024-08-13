import { Box } from "@radix-ui/themes";

interface RestaurantImageProps {
  image: string;
  name: string;
}

const RestaurantImage = ({ image, name }: RestaurantImageProps) => (
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
      src={image}
      alt={name}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  </Box>
);

export default RestaurantImage;
