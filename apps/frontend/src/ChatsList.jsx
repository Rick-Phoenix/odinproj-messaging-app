import { use } from "react";
import { UserContext } from "../utils.js";
import { Link } from "react-router-dom";

export default function ChatsList() {
  const { userData } = use(UserContext);

  if (!userData) return <></>;

  const { chats } = userData;
  return (
    <>
      {chats.length === 0 && <b>No chats started yet.</b>}
      {chats.length > 0 && (
        <ul className="chats">
          {chats.map((chat) => {
            let chatInfo = {};
            if (chat.name) {
              chatInfo.name = chat.name;
              chatInfo.picUrl =
                chat.chatPicUrl ||
                "https://res.cloudinary.com/dqjizh49f/image/upload/v1734014258/Messaging%20App/mvnscba5oovyl1je3pdq.jpg";
            }
            if (!chat.name) {
              const contact = chat.participants.find(
                (user) => user.username !== userData.username
              );
              chatInfo.name = contact.username;
              chatInfo.picUrl = contact.pfpurl;
            }
            return (
              <li key={chat.id}>
                <Link
                  className="chatItem"
                  to={
                    !chat.name
                      ? `/chats/${chatInfo.name}`
                      : `/groupChats/${chat.id}`
                  }
                >
                  <img
                    className="chatPic"
                    src={chatInfo.picUrl}
                    alt={chatInfo.name}
                  />
                  <div className="chatTitle">{chatInfo.name}</div>
                  <div className="lastMessage">
                    {chat.messages[0].picUrl ? "Image" : chat.messages[0]?.text}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
