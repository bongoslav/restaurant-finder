import { Container, Theme } from "@radix-ui/themes";
import Header from "./components/Header";
import useTheme from "./hooks/useTheme";
import { ThemeContext } from "./context/themeContext";
import RestaurantGrid from "./components/RestaurantGrid";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Theme accentColor="tomato" appearance={theme}>
        <Container size="4">
          <Header />
          <main>
            <RestaurantGrid />
          </main>
        </Container>
      </Theme>
    </ThemeContext.Provider>
  );
}

export default App;
