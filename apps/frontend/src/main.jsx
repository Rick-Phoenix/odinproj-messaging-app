import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import SignUpPage from "./SignUpPage.jsx";
import LoginPage from "./LoginPage.jsx";

const routes = [
  {
    path: "/",
    element: <App />,
  },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/login", element: <LoginPage /> },
];

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
