import React, { useState } from "react";
import {
  Dialog,
  Flex,
  Button,
  TextField,
  Text,
  Select,
} from "@radix-ui/themes";
import { useAuth } from "../../hooks/useAuth";
import { Restaurant } from "../../types/Restaurant";
import API_URL from "../../util/apiUrl";

interface EditRestaurantDialogProps {
  restaurant: Restaurant;
  onRestaurantUpdated: () => void;
  children: React.ReactNode;
}

const EditRestaurantDialog = ({
  restaurant,
  onRestaurantUpdated,
  children,
}: EditRestaurantDialogProps) => {
  const [name, setName] = useState(restaurant.name);
  const [location, setLocation] = useState(restaurant.location);
  const [priceRange, setPriceRange] = useState(
    restaurant.priceRange.toString()
  );
  const [cuisine, setCuisine] = useState(restaurant.cuisine);
  const { getTokenFromStorage } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = getTokenFromStorage();

    try {
      const response = await fetch(
        `${API_URL}/api/v1/restaurants/${restaurant._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            location,
            priceRange: parseInt(priceRange, 10),
            cuisine,
          }),
        }
      );

      if (response.ok) {
        onRestaurantUpdated();
      } else {
        console.error("Failed to update restaurant");
      }
    } catch (error) {
      console.error("Error updating restaurant:", error);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Edit Restaurant</Dialog.Title>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Name
              </Text>
              <TextField.Root
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Location
              </Text>
              <TextField.Root
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Price Range
              </Text>
              <Select.Root
                value={priceRange.toString()}
                onValueChange={setPriceRange}
                required
              >
                <Select.Trigger placeholder="Rating" />
                <Select.Content>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Select.Item key={value} value={value.toString()}>
                      {value}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Cuisine
              </Text>
              <TextField.Root
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
              />
            </label>
            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button
                  variant="soft"
                  color="gray"
                  style={{ cursor: "pointer" }}
                >
                  Cancel
                </Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button type="submit" style={{ cursor: "pointer" }}>
                  Save Changes
                </Button>
              </Dialog.Close>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EditRestaurantDialog;
