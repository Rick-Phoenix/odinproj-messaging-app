import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import SignUpPage from "./SignUpPage.jsx";
import LoginPage from "./LoginPage.jsx";
import { UserContextProvider } from "./UserContext.jsx";
import ProfilePage from "./ProfilePage.jsx";
import UserProfile from "./UserProfile.jsx";
import Chat from "./Chat.jsx";
import GroupChatForm from "./GroupChatForm.jsx";
import GroupChat from "./GroupChat.jsx";
import FunctionalWrapper from "./FunctionalWrapper.jsx";
import FriendRequests from "./FriendRequests.jsx";

const routes = [
  {
    path: "/",
    element: <FunctionalWrapper />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      { path: "/signup", element: <SignUpPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/profile/:username", element: <ProfilePage /> },
      { path: "/profile/myProfile", element: <UserProfile /> },
      { path: "/chats/:contactUsername", element: <Chat /> },
      { path: "/chats/newGroupChat", element: <GroupChatForm /> },
      { path: "/groupChats/:chatId", element: <GroupChat /> },
      { path: "/friends", element: <FriendRequests /> },
    ],
  },
];

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </StrictMode>
);
