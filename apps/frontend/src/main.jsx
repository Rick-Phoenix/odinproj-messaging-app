import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import SignUpPage from "./SignUpPage.jsx";
import LoginPage from "./LoginPage.jsx";
import { UserContextProvider } from "./UserContext.jsx";
import ProfilePage from "./ProfilePage.jsx";
import UserProfile from "./UserProfile.jsx";

const routes = [
  {
    path: "/",
    element: <App />,
  },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/profile/:username", element: <ProfilePage /> },
  { path: "/profile/myProfile", element: <UserProfile /> },
];

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </StrictMode>
);
