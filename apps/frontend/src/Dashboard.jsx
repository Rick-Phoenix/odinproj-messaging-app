import { useNavigate } from "react-router-dom";
import AddFriend from "./AddFriend.jsx";
import FriendRequests from "./FriendRequests.jsx";
import { UserContext } from "../utils.js";
import { use } from "react";
import Friends from "./Friends.jsx";
import ChatsList from "./ChatsList.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userData } = use(UserContext);

  function handleLogout() {
    localStorage.removeItem("JWT");
    navigate(0);
  }

  return (
    <>
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
      <ChatsList />
    </>
  );
}
