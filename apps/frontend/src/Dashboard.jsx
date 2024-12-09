import { useNavigate } from "react-router-dom";
import { UserContext } from "../utils.js";
import { use } from "react";
import AddFriend from "./AddFriend.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = use(UserContext);

  function handleLogout() {
    localStorage.removeItem("JWT");
    navigate(0);
  }

  return (
    <>
      <h1>Hello, {user.username}!</h1>
      <button type="button" onClick={handleLogout}>
        Log Out
      </button>
      <AddFriend />
    </>
  );
}
