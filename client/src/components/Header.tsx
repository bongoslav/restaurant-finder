import { Flex, Switch, Heading } from "@radix-ui/themes";
import { useContext } from "react";
import { ThemeContext } from "../context/themeContext";
import LoginDialog from "./LoginDialog";
import SignupDialog from "./SignupDialog";

function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Flex p="4" justify="between" align="center">
      <Heading>Restaurant Finder</Heading>
      <Flex gap="4" align="center" style={{ marginLeft: "auto" }}>
        <LoginDialog />
        <SignupDialog />
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
