import { Flex, Switch, Heading, Text, Button } from "@radix-ui/themes";
import { useContext } from "react";
import { ThemeContext } from "../context/themeContext";
import LoginDialog from "./LoginDialog";
import SignupDialog from "./SignupDialog";
import { useAuth } from "../hooks/useAuth";

function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <Flex p="4" justify="between" align="center">
      <Heading>Restaurant Finder</Heading>
      <Flex gap="4" align="center" style={{ marginLeft: "auto" }}>
        {isAuthenticated && user ? (
          <>
            <Text>Welcome, {user.name}</Text>
            <Button
              onClick={logout}
              style={{ cursor: "pointer" }}
              variant="soft"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <LoginDialog />
            <SignupDialog />
          </>
        )}
        <Switch
          style={{ cursor: "var(--cursor-link)" }}
          checked={theme === "dark"}
          onCheckedChange={toggleTheme}
        />
      </Flex>
    </Flex>
  );
}

export default Header;
