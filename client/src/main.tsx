import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@radix-ui/themes/styles.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RestaurantDetailsPage from "./pages/RestaurantDetailsPage.tsx";
import RestaurantListPage from "./pages/RestaurantsListPage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <RestaurantListPage />,
      },
      {
        path: "restaurant/:id",
        element: <RestaurantDetailsPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
