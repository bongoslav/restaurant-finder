import { Container, Theme } from "@radix-ui/themes";
import Header from "./components/Header";
import useTheme from "./hooks/useTheme";
import { ThemeContext } from "./context/themeContext";
import { Outlet } from "react-router-dom";
import AuthProvider from "./context/authContext";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <AuthProvider>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <Theme accentColor="tomato" appearance={theme}>
          <Container size="4">
            <Header />
            <main>
              <Outlet />
            </main>
          </Container>
        </Theme>
      </ThemeContext.Provider>
    </AuthProvider>
  );
}

export default App;
