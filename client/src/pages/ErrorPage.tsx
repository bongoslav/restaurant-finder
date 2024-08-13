import { useEffect, useState } from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Container,
  Theme,
} from "@radix-ui/themes";
import { ExclamationTriangleIcon, HomeIcon } from "@radix-ui/react-icons";

interface RouterError {
  statusText?: string;
  message?: string;
}

const ErrorPage = () => {
  const error = useRouteError() as RouterError;
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setCurrentTheme(storedTheme === "dark" ? "dark" : "light");
  }, []);

  return (
    <Theme accentColor="tomato" appearance={currentTheme}>
      <Box
        style={{
          height: "100vh",
          backgroundColor: "var(--color-background)",
          color: "var(--color-text)",
        }}
      >
        <Container size="2">
          <Flex
            direction="column"
            align="center"
            justify="center"
            style={{ height: "100vh" }}
          >
            <ExclamationTriangleIcon
              color="var(--accent-9)"
              width={60}
              height={60}
            />
            <Heading size="8" mt="5" mb="2">
              Oops!
            </Heading>
            <Text size="5" mb="3" align="center">
              Sorry, an unexpected error has occurred.
            </Text>
            <Box
              mb="5"
              p="4"
              style={{
                backgroundColor: "var(--accent-2)",
                borderRadius: "var(--radius-3)",
                border: "1px solid var(--accent-6)",
              }}
            >
              <Text size="3">
                {error.statusText || error.message || "Not Found"}
              </Text>
            </Box>
            <Button
              size="3"
              onClick={() => navigate("/")}
              variant="soft"
              style={{ cursor: "pointer" }}
            >
              <HomeIcon width={16} height={16} />
              Go back to home page
            </Button>
          </Flex>
        </Container>
      </Box>
    </Theme>
  );
};

export default ErrorPage;
