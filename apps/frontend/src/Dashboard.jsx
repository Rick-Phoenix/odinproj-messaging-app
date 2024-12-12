import { useNavigate } from "react-router-dom";
import AddFriend from "./AddFriend.jsx";
import FriendRequests from "./FriendRequests.jsx";
import { UserContext } from "../utils.js";
import { use, useState } from "react";
import Friends from "./Friends.jsx";
import ChatsList from "./ChatsList.jsx";
import Sidebar from "./Sidebar.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userData } = use(UserContext);
  const [toggleSidebar, setToggleSidebar] = useState(false);

  console.log(userData);

  function handleLogout() {
    localStorage.removeItem("JWT");
    navigate(0);
  }

  return (
    <>
      <Sidebar toggled={toggleSidebar}>
        <h1>Hello, {userData.username}!</h1>
        <button type="button" onClick={handleLogout}>
          Log Out
        </button>
        <button
          type="button"
          onClick={() => {
            navigate(`/profile/myProfile`);
          }}
        >
          View My Profile
        </button>
        <button
          type="button"
          onClick={() => {
            navigate("/chats/newGroupChat");
          }}
        >
          Make a new group chat
        </button>
        <AddFriend />
        <FriendRequests />
        <Friends />
      </Sidebar>
      <button
        type="button"
        onClick={() => {
          setToggleSidebar(!toggleSidebar);
        }}
      >
        Toggle sidebar
      </button>
      <ChatsList />
    </>
  );
}
