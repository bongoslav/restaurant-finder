import { Route } from "react-router-dom";
import { BrowserRouter, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RestaurantUpdate from "./pages/RestaurantUpdate";
import RestaurantDetails from "./pages/RestaurantDetails";
import "./App.css";
import { RestaurantsContextProvider } from "./context/restaurantsContext";

function App() {
  return (
    <RestaurantsContextProvider>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/restaurants/:id/update"
              element={<RestaurantUpdate />}
            />
            <Route path="/restaurants/:id" element={<RestaurantDetails />} />
          </Routes>
        </BrowserRouter>
      </div>
    </RestaurantsContextProvider>
  );
}

export default App;
