import { Flex, Switch, Heading, Text, Button } from "@radix-ui/themes";
import { useContext } from "react";
import { ThemeContext } from "../context/themeContext";
import LoginDialog from "./LoginDialog";
import SignupDialog from "./SignupDialog";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <Flex p="4" justify="between" align="center">
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Heading>Restaurant Finder</Heading>
      </Link>
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
