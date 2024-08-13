import React, { useState } from "react";
import {
  TextField,
  Button,
  Flex,
  Text,
  Box,
  Select,
  TextArea,
} from "@radix-ui/themes";
import { useAuth } from "../../hooks/useAuth";
import API_URL from "../../util/apiUrl";

interface AddReviewFormProps {
  restaurantId: string;
  onReviewAdded: () => void;
}

const AddReviewForm = ({ restaurantId, onReviewAdded }: AddReviewFormProps) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState("");
  const { isAuthenticated, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/v1/restaurants/${restaurantId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            title,
            text,
            rating: parseInt(rating, 10),
          }),
        }
      );

      if (response.ok) {
        setTitle("");
        setText("");
        setRating("");
        onReviewAdded();
      } else {
        console.error("Failed to add review");
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  if (!isAuthenticated) {
    return <Text>Please log in to add a review.</Text>;
  }

  return (
    <Box style={{ maxWidth: "500px" }}>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="3">
          <TextField.Root
            placeholder="Review Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          ></TextField.Root>
          <TextArea
            placeholder="Review Summary"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          ></TextArea>
          <Flex align="center">
            <Select.Root value={rating} onValueChange={setRating} required>
              <Select.Trigger placeholder="Rating" />
              <Select.Content>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Select.Item key={value} value={value.toString()}>
                    {value}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
          <Box
            style={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Button type="submit" style={{ width: "auto", cursor: "pointer" }}>
              Submit Review
            </Button>
          </Box>
        </Flex>
      </form>
    </Box>
  );
};

export default AddReviewForm;
