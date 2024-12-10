import { use } from "react";
import { UserContext } from "../utils.js";
import { Link } from "react-router-dom";

export default function ChatsList() {
  const { userData } = use(UserContext);
  return (
    <>
      <h3>Chats</h3>
      {userData.chats.length === 0 && <b>No chats started yet.</b>}
      {userData.chats.length > 0 &&
        userData.chats.map((chat) => {
          const chatTitle =
            chat.name ||
            chat.participants.find(
              (user) => user.username !== userData.username
            ).username;
          return (
            <div key={chat.id}>
              <Link to={`/chats/${chatTitle}`}>
                <div>{chatTitle}</div>
                <div>{chat.messages[0]?.text}</div>
              </Link>
            </div>
          );
        })}
    </>
  );
}
