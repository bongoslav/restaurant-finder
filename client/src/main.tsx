import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@radix-ui/themes/styles.css";
// import LoginPage from "./pages/LoginPage.tsx";
// import RestaurantGrid from "./components/RestaurantGrid.tsx";

// // TODO: loader, error page
// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         path: "",
//         element: <RestaurantGrid />, 
//       },
//       {
//         path: "login",
//         element: <LoginPage />, 
//       },
//       // {
//       //   path: "signup",
//       //   element: <SignupPage />, 
//       // },
//     ],
//   },
// ]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <RouterProvider router={router} /> */}
    <App />
  </React.StrictMode>
);
